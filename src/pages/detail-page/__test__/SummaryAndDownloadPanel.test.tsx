import { describe, expect, it, vi } from "vitest";
import { buildMapLayerConfig } from "../features/MapPanel";
import {
  LayerName,
  LayerSwitcherLayer,
} from "@/components/map/mapbox/controls/menu/MapLayerSwitcher";
import {
  OGCCollection,
  DatasetType,
} from "@/app/store/OGCCollectionDefinitions";

describe("buildMapLayerConfig", () => {
  // Helper function to create a mock OGCCollection
  const createMockCollection = (
    overrides: Partial<{
      hasCloudOptimisedData: boolean;
      getDatasetType: () => DatasetType[] | undefined;
      getBBox: () => unknown;
    }> = {}
  ) => {
    return {
      hasCloudOptimisedData: vi
        .fn()
        .mockReturnValue(overrides.hasCloudOptimisedData ?? false),
      getDatasetType: vi
        .fn()
        .mockReturnValue(overrides.getDatasetType?.() ?? undefined),
      getBBox: vi.fn().mockReturnValue(overrides.getBBox?.() ?? undefined),
    } as unknown as OGCCollection;
  };

  it("returns empty array when collection is null", () => {
    const result = buildMapLayerConfig(null, false, false, false);
    expect(result).toEqual([]);
  });

  it("returns empty array when collection is undefined", () => {
    const result = buildMapLayerConfig(undefined, false, false, false);
    expect(result).toEqual([]);
  });

  it("builds correct layer config with PMTiles Data Density support", () => {
    const mockCollection = createMockCollection({
      hasCloudOptimisedData: true,
      getDatasetType: () => [DatasetType.PARQUET],
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      true, // isWMSAvailable
      true, // hasSpatialExtent
      true // isSupportPMTiles
    );

    // Density is PMTiles only
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: LayerName.PMTiles,
      name: "Data Density",
      selected: true,
    } as LayerSwitcherLayer<LayerName>);
    expect(result[1]).toEqual({
      id: LayerName.GeoServer,
      name: "Geoserver",
      selected: false,
    } as LayerSwitcherLayer<LayerName>);
  });

  it("builds correct layer config for zarr dataset with spatial extent", () => {
    const mockCollection = createMockCollection({
      hasCloudOptimisedData: true,
      getDatasetType: () => [DatasetType.ZARR], // zarr-only -> spatial extent support
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      false, // isWMSAvailable
      true, // hasSpatialExtent
      false // isSupportPMTiles
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: LayerName.SpatialExtent,
      name: "Spatial Extent",
      selected: true, // Should be set to true as it's the only layer
    } as LayerSwitcherLayer<LayerName>);
  });

  it("sets first layer as default when no layer has default set to true", () => {
    const mockCollection = createMockCollection({
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      false, // isWMSAvailable (no WMS, no density -> spatial extent should be available)
      true, // hasSpatialExtent
      false // isSupportPMTiles
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: LayerName.SpatialExtent,
      name: "Spatial Extent",
      selected: true, // Should be set to true as it's the only layer
    } as LayerSwitcherLayer<LayerName>);
  });

  it("builds layer config with PMTiles and GeoServer defaults", () => {
    const mockCollection = createMockCollection({
      getDatasetType: () => [DatasetType.PARQUET],
      getBBox: () => [0, 0, 1, 1],
    });

    const result = buildMapLayerConfig(
      mockCollection,
      true, // isWMSAvailable
      true, // hasSpatialExtent
      true // isSupportPMTiles
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: LayerName.PMTiles,
      name: "Data Density",
      selected: true,
    } as LayerSwitcherLayer<LayerName>);
    expect(result[1]).toEqual({
      id: LayerName.GeoServer,
      name: "Geoserver",
      selected: false, // Not default because PMTiles is available
    } as LayerSwitcherLayer<LayerName>);
  });

  it("returns empty array when no layers are available (no preview mode)", () => {
    const mockCollection = createMockCollection({
      hasCloudOptimisedData: false,
      getDatasetType: () => undefined, // not zarr
      getBBox: () => undefined, // no spatial extent
    });
    const result = buildMapLayerConfig(
      mockCollection,
      false, // isWMSAvailable = false
      false, // hasSpatialExtent = false
      false // isSupportPMTiles = false
    );
    // Should return empty array (no layers available)
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  describe("gridded raster layer", () => {
    const zarrCollection = (bbox?: unknown) =>
      createMockCollection({
        hasCloudOptimisedData: true,
        getDatasetType: () => [DatasetType.ZARR],
        getBBox: () => bbox,
      });

    it("appends Gridded Data last without changing the PMTiles default", () => {
      const result = buildMapLayerConfig(
        createMockCollection({
          getDatasetType: () => [DatasetType.PARQUET],
          getBBox: () => [0, 0, 1, 1],
        }),
        true, // isWMSAvailable
        true, // hasSpatialExtent
        true, // isSupportPMTiles
        null,
        true // hasGriddedProducts
      );

      expect(result.map((l) => l.id)).toEqual([
        LayerName.PMTiles,
        LayerName.GeoServer,
        LayerName.GriddedRaster,
      ]);
      expect(result.find((l) => l.selected)?.id).toBe(LayerName.PMTiles);
    });

    it("leaves a WMS record defaulting to Geoserver", () => {
      const result = buildMapLayerConfig(
        createMockCollection({
          getDatasetType: () => [DatasetType.ZARR],
          getBBox: () => undefined,
        }),
        true, // isWMSAvailable
        false, // hasSpatialExtent
        false, // isSupportPMTiles
        null,
        true // hasGriddedProducts
      );

      expect(result.map((l) => l.id)).toEqual([
        LayerName.GeoServer,
        LayerName.GriddedRaster,
      ]);
      expect(result.find((l) => l.selected)?.id).toBe(LayerName.GeoServer);
    });

    // Gridded Data takes priority: a zarr record with a bbox would otherwise
    // qualify for Spatial Extent too, but that's redundant once gridded
    // raster tiles are offered, so Spatial Extent is suppressed entirely.
    it("hides Spatial Extent when Gridded Data is available, even for a zarr record with a bbox", () => {
      const result = buildMapLayerConfig(
        zarrCollection([0, 0, 1, 1]),
        false, // isWMSAvailable
        true, // hasSpatialExtent
        false, // isSupportPMTiles
        null,
        true // hasGriddedProducts
      );

      expect(result.map((l) => l.id)).toEqual([LayerName.GriddedRaster]);
      expect(result.find((l) => l.selected)?.id).toBe(LayerName.GriddedRaster);
    });

    it("selects Gridded Data only when it is the sole entry", () => {
      const result = buildMapLayerConfig(
        zarrCollection(undefined),
        false, // isWMSAvailable
        false, // hasSpatialExtent
        false, // isSupportPMTiles
        null,
        true // hasGriddedProducts
      );

      expect(result).toEqual([
        {
          id: LayerName.GriddedRaster,
          name: "Gridded Data",
          selected: true,
        } as LayerSwitcherLayer<LayerName>,
      ]);
    });

    it("adds no entry when the listing came back empty", () => {
      const result = buildMapLayerConfig(
        zarrCollection([0, 0, 1, 1]),
        false, // isWMSAvailable
        true, // hasSpatialExtent
        false, // isSupportPMTiles
        null,
        false // hasGriddedProducts
      );

      expect(result.map((l) => l.id)).toEqual([LayerName.SpatialExtent]);
      expect(result.find((l) => l.selected)?.id).toBe(LayerName.SpatialExtent);
    });

    it("honours a sticky Gridded Data selection over PMTiles", () => {
      const result = buildMapLayerConfig(
        createMockCollection({
          getDatasetType: () => [DatasetType.ZARR],
          getBBox: () => [0, 0, 1, 1],
        }),
        false, // isWMSAvailable
        true, // hasSpatialExtent
        true, // isSupportPMTiles
        { id: LayerName.GriddedRaster, name: "Gridded Data" },
        true // hasGriddedProducts
      );

      // Spatial Extent would otherwise qualify (zarr + bbox) but is
      // suppressed since Gridded Data is available.
      expect(result.map((l) => l.id)).toEqual([
        LayerName.PMTiles,
        LayerName.GriddedRaster,
      ]);
      expect(result.find((l) => l.selected)?.id).toBe(LayerName.GriddedRaster);
    });

    // The staleness guard. DetailPageProvider is not remounted on a UUID change
    // (the route carries no key), so lastSelectedMapLayer survives navigation to
    // a record that has no gridded products.
    it("never leaves zero layers selected when the sticky layer is gone", () => {
      const result = buildMapLayerConfig(
        createMockCollection({
          getDatasetType: () => [DatasetType.PARQUET],
          getBBox: () => [0, 0, 1, 1],
        }),
        true, // isWMSAvailable
        true, // hasSpatialExtent
        true, // isSupportPMTiles
        { id: LayerName.GriddedRaster, name: "Gridded Data" },
        false // hasGriddedProducts — this collection has none
      );

      expect(result.filter((l) => l.selected)).toHaveLength(1);
      expect(result.find((l) => l.selected)?.id).toBe(LayerName.PMTiles);
    });
  });
});

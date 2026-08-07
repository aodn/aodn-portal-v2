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
      getBBox: () => any;
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

    // Hex Grid removed — density is PMTiles only
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
      false, // isWMSAvailable (no WMS, no hexbin -> spatial extent should be available)
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
});

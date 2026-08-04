import { describe, expect, it, vi } from "vitest";
import { buildMapLayerConfig } from "../features/MapPanel";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import {
  defaultMapSubsettingCapabilities,
  DownloadServiceType,
  evaluateSubsettingSupport,
  MapSubsettingCapabilities,
  SubsettingType,
} from "../context/DownloadDefinitions";
import {
  LayerName,
  LayerSwitcherLayer,
} from "@/components/map/mapbox/controls/menu/MapLayerSwitcher";

const layerNames = {
  PMTiles: LayerName.PMTiles,
  GeoServer: LayerName.GeoServer,
};

const isSupported = (type: SubsettingType, caps: MapSubsettingCapabilities) =>
  evaluateSubsettingSupport(type, caps, layerNames);

// `buildMapLayerConfig` only reads the dataset types off the collection
const createMockCollection = (datasetTypes?: DatasetType[]) =>
  ({
    getDatasetType: vi.fn().mockReturnValue(datasetTypes),
  }) as unknown as OGCCollection;

const layer = (id: LayerName, name: string): LayerSwitcherLayer<LayerName> => ({
  id,
  name,
  selected: true,
});

interface ExpectedBehaviourRow {
  row: number;
  description: string;
  // undefined = not a cloud optimised record (no `rel=summary` links)
  datasetTypes?: DatasetType[];
  isWMSAvailable: boolean;
  hasSpatialExtent: boolean;
  isSupportPMTiles: boolean;
  pmtilesHasTime?: boolean;
  // wms_fields carries a datetime / geom field for the selected layer
  wmsHasDatetimeField: boolean;
  wmsHasGeomField: boolean;
  hasWfsDownload: boolean;
  expectedLayers: string[];
  expectedSelected?: string;
  expectedTimeSlider: boolean;
  expectedDrawRect: boolean;
}

// The detail page map's expected behaviour table. Layers are listed in the
// order they are built, which is also the default selection priority:
// Data Density > Geoserver > Spatial Extent.
const EXPECTED_BEHAVIOUR_TABLE: ExpectedBehaviourRow[] = [
  {
    row: 1,
    description: "zarr with wms and spatial extent",
    datasetTypes: [DatasetType.ZARR],
    isWMSAvailable: true,
    hasSpatialExtent: true,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Geoserver", "Spatial Extent"],
    expectedSelected: "Geoserver",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 2,
    description: "zarr with spatial extent only",
    datasetTypes: [DatasetType.ZARR],
    isWMSAvailable: false,
    hasSpatialExtent: true,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Spatial Extent"],
    expectedSelected: "Spatial Extent",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 3,
    description: "zarr with wms only",
    datasetTypes: [DatasetType.ZARR],
    isWMSAvailable: true,
    hasSpatialExtent: false,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Geoserver"],
    expectedSelected: "Geoserver",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 4,
    description: "zarr with no wms and no spatial extent (subsets on base map)",
    datasetTypes: [DatasetType.ZARR],
    isWMSAvailable: false,
    hasSpatialExtent: false,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: [],
    expectedSelected: undefined,
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 5,
    description: "parquet with pmtiles, wms and spatial extent",
    datasetTypes: [DatasetType.PARQUET],
    isWMSAvailable: true,
    hasSpatialExtent: true,
    isSupportPMTiles: true,
    pmtilesHasTime: true,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Data Density", "Geoserver"],
    expectedSelected: "Data Density",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 6,
    description: "parquet with pmtiles and spatial extent, no wms",
    datasetTypes: [DatasetType.PARQUET],
    isWMSAvailable: false,
    hasSpatialExtent: true,
    isSupportPMTiles: true,
    pmtilesHasTime: true,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Data Density"],
    expectedSelected: "Data Density",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 7,
    description: "parquet without pmtiles, falls back to wms",
    datasetTypes: [DatasetType.PARQUET],
    isWMSAvailable: true,
    hasSpatialExtent: true,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Geoserver"],
    expectedSelected: "Geoserver",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 8,
    description: "parquet without pmtiles or wms, falls back to spatial extent",
    datasetTypes: [DatasetType.PARQUET],
    isWMSAvailable: false,
    hasSpatialExtent: true,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Spatial Extent"],
    expectedSelected: "Spatial Extent",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 9,
    description: "mixed parquet and zarr with pmtiles and wms",
    datasetTypes: [DatasetType.PARQUET, DatasetType.ZARR],
    isWMSAvailable: true,
    hasSpatialExtent: true,
    isSupportPMTiles: true,
    pmtilesHasTime: true,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: false,
    expectedLayers: ["Data Density", "Geoserver"],
    expectedSelected: "Data Density",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 10,
    description: "not cloud optimised, wms with datetime and geom fields",
    datasetTypes: undefined,
    isWMSAvailable: true,
    hasSpatialExtent: true,
    isSupportPMTiles: false,
    wmsHasDatetimeField: true,
    wmsHasGeomField: true,
    hasWfsDownload: true,
    expectedLayers: ["Geoserver"],
    expectedSelected: "Geoserver",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 11,
    description: "not cloud optimised with spatial extent only, no subsetting",
    datasetTypes: undefined,
    isWMSAvailable: false,
    hasSpatialExtent: true,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: true,
    expectedLayers: ["Spatial Extent"],
    expectedSelected: "Spatial Extent",
    expectedTimeSlider: false,
    expectedDrawRect: false,
  },
  {
    row: 12,
    description: "not cloud optimised, wms without spatial extent",
    datasetTypes: undefined,
    isWMSAvailable: true,
    hasSpatialExtent: false,
    isSupportPMTiles: false,
    wmsHasDatetimeField: true,
    wmsHasGeomField: true,
    hasWfsDownload: true,
    expectedLayers: ["Geoserver"],
    expectedSelected: "Geoserver",
    expectedTimeSlider: true,
    expectedDrawRect: true,
  },
  {
    row: 13,
    description: "not cloud optimised with nothing to render",
    datasetTypes: undefined,
    isWMSAvailable: false,
    hasSpatialExtent: false,
    isSupportPMTiles: false,
    wmsHasDatetimeField: false,
    wmsHasGeomField: false,
    hasWfsDownload: true,
    expectedLayers: [],
    expectedSelected: undefined,
    expectedTimeSlider: false,
    expectedDrawRect: false,
  },
];

describe("MapPanel expected behaviour table", () => {
  it.each(EXPECTED_BEHAVIOUR_TABLE)(
    "row $row - $description",
    ({
      datasetTypes,
      isWMSAvailable,
      hasSpatialExtent,
      isSupportPMTiles,
      pmtilesHasTime,
      wmsHasDatetimeField,
      wmsHasGeomField,
      hasWfsDownload,
      expectedLayers,
      expectedSelected,
      expectedTimeSlider,
      expectedDrawRect,
    }) => {
      const layers = buildMapLayerConfig(
        createMockCollection(datasetTypes),
        isWMSAvailable,
        hasSpatialExtent,
        isSupportPMTiles
      );

      expect(layers.map((l) => l.name)).toEqual(expectedLayers);
      expect(layers.find((l) => l.selected)?.name).toBe(expectedSelected);

      // A `rel=summary` link is what makes a record cloud optimised, and the
      // download service resolves from that plus any wfs download link
      const hasCloudOptimisedData = datasetTypes !== undefined;
      const downloadService = hasCloudOptimisedData
        ? DownloadServiceType.CloudOptimised
        : hasWfsDownload
          ? DownloadServiceType.WFS
          : DownloadServiceType.Unavailable;

      const caps: MapSubsettingCapabilities = {
        hasCloudOptimisedData,
        downloadServiceAvailable:
          downloadService !== DownloadServiceType.Unavailable,
        selectedLayerId: layers.find((l) => l.selected)?.id ?? null,
        isSupportPMTiles,
        pmtilesHasTime: pmtilesHasTime ?? null,
        geoServerHasTime: wmsHasDatetimeField,
        geoServerDrawRect: wmsHasGeomField,
      };

      expect(isSupported(SubsettingType.TimeSlider, caps)).toBe(
        expectedTimeSlider
      );
      expect(isSupported(SubsettingType.DrawRect, caps)).toBe(expectedDrawRect);
    }
  );
});

describe("buildMapLayerConfig - lastSelectedLayer", () => {
  it("keeps the remembered layer selected over the priority default", () => {
    const layers = buildMapLayerConfig(
      createMockCollection([DatasetType.ZARR]),
      true, // isWMSAvailable
      true, // hasSpatialExtent
      false, // isSupportPMTiles
      layer(LayerName.SpatialExtent, "Spatial Extent")
    );

    expect(layers.map((l) => l.name)).toEqual(["Geoserver", "Spatial Extent"]);
    // Geoserver is the priority default, but the remembered layer wins
    expect(layers.find((l) => l.selected)?.name).toBe("Spatial Extent");
  });

  it("falls back to the first layer when the remembered layer is not built", () => {
    const layers = buildMapLayerConfig(
      createMockCollection([DatasetType.PARQUET]),
      true, // isWMSAvailable
      true, // hasSpatialExtent
      true, // isSupportPMTiles
      layer(LayerName.SpatialExtent, "Spatial Extent")
    );

    expect(layers.map((l) => l.name)).toEqual(["Data Density", "Geoserver"]);
    expect(layers.find((l) => l.selected)?.name).toBe("Data Density");
    // Never leave the switcher with nothing selected - the map would be blank
    expect(layers.filter((l) => l.selected)).toHaveLength(1);
  });

  it("falls back when the remembered density layer loses its pmtiles", () => {
    const layers = buildMapLayerConfig(
      createMockCollection([DatasetType.PARQUET]),
      true, // isWMSAvailable
      true, // hasSpatialExtent
      false, // isSupportPMTiles - tiles turned out to be missing on s3
      layer(LayerName.PMTiles, "Data Density")
    );

    expect(layers.map((l) => l.name)).toEqual(["Geoserver"]);
    expect(layers.find((l) => l.selected)?.name).toBe("Geoserver");
  });

  it("returns an empty config when no layer can be built", () => {
    const layers = buildMapLayerConfig(
      createMockCollection([DatasetType.ZARR]),
      false, // isWMSAvailable
      false, // hasSpatialExtent
      false, // isSupportPMTiles
      layer(LayerName.SpatialExtent, "Spatial Extent")
    );

    expect(layers).toEqual([]);
  });
});

describe("evaluateSubsettingSupport", () => {
  const buildCaps = (
    overrides: Partial<MapSubsettingCapabilities> = {}
  ): MapSubsettingCapabilities => ({
    ...defaultMapSubsettingCapabilities,
    ...overrides,
  });

  describe("TimeSlider", () => {
    const isTimeSliderSupported = (
      overrides: Partial<MapSubsettingCapabilities>
    ) => isSupported(SubsettingType.TimeSlider, buildCaps(overrides));

    it("is off for timeless pmtiles even when the data is cloud optimised", () => {
      expect(
        isTimeSliderSupported({
          hasCloudOptimisedData: true,
          downloadServiceAvailable: true,
          selectedLayerId: LayerName.PMTiles,
          isSupportPMTiles: true,
          pmtilesHasTime: false,
        })
      ).toBe(false);
    });

    it("is on for pmtiles with a time dimension", () => {
      expect(
        isTimeSliderSupported({
          hasCloudOptimisedData: true,
          selectedLayerId: LayerName.PMTiles,
          isSupportPMTiles: true,
          pmtilesHasTime: true,
        })
      ).toBe(true);
    });

    it("is on for pmtiles before the metadata sidecar has loaded", () => {
      expect(
        isTimeSliderSupported({
          selectedLayerId: LayerName.PMTiles,
          isSupportPMTiles: true,
          pmtilesHasTime: null,
        })
      ).toBe(true);
    });

    it("is on for cloud optimised data regardless of the wms fields", () => {
      expect(
        isTimeSliderSupported({
          hasCloudOptimisedData: true,
          selectedLayerId: LayerName.GeoServer,
          geoServerHasTime: false,
        })
      ).toBe(true);
    });

    it("follows the wms datetime field when the data is not cloud optimised", () => {
      expect(
        isTimeSliderSupported({
          selectedLayerId: LayerName.GeoServer,
          geoServerHasTime: true,
        })
      ).toBe(true);
      expect(
        isTimeSliderSupported({
          selectedLayerId: LayerName.GeoServer,
          geoServerHasTime: false,
        })
      ).toBe(false);
    });

    it("is off on the spatial extent layer when the data is not cloud optimised", () => {
      expect(
        isTimeSliderSupported({
          selectedLayerId: LayerName.SpatialExtent,
          geoServerHasTime: true,
        })
      ).toBe(false);
    });
  });

  describe("DrawRect", () => {
    const isDrawRectSupported = (
      overrides: Partial<MapSubsettingCapabilities>
    ) => isSupported(SubsettingType.DrawRect, buildCaps(overrides));

    it("is on for cloud optimised data before the download service resolves", () => {
      // `downloadService` starts out Unavailable until DownloadCard's effect
      // runs, so the cloud optimised check has to come first
      expect(
        isDrawRectSupported({
          hasCloudOptimisedData: true,
          downloadServiceAvailable: false,
          selectedLayerId: LayerName.SpatialExtent,
        })
      ).toBe(true);
    });

    it("is off without a download service when the data is not cloud optimised", () => {
      expect(
        isDrawRectSupported({
          downloadServiceAvailable: false,
          selectedLayerId: LayerName.GeoServer,
          geoServerDrawRect: true,
        })
      ).toBe(false);
    });

    it("follows the wms geom field on a wfs download", () => {
      expect(
        isDrawRectSupported({
          downloadServiceAvailable: true,
          selectedLayerId: LayerName.GeoServer,
          geoServerDrawRect: true,
        })
      ).toBe(true);
      expect(
        isDrawRectSupported({
          downloadServiceAvailable: true,
          selectedLayerId: LayerName.GeoServer,
          geoServerDrawRect: false,
        })
      ).toBe(false);
    });

    it("is on for the pmtiles layer", () => {
      expect(
        isDrawRectSupported({
          downloadServiceAvailable: true,
          selectedLayerId: LayerName.PMTiles,
          isSupportPMTiles: true,
        })
      ).toBe(true);
    });

    it("is off on the spatial extent layer when the data is not cloud optimised", () => {
      expect(
        isDrawRectSupported({
          downloadServiceAvailable: true,
          selectedLayerId: LayerName.SpatialExtent,
          geoServerDrawRect: true,
        })
      ).toBe(false);
    });
  });

  it("is off for an unknown subsetting type", () => {
    expect(
      isSupported(
        "Unknown" as SubsettingType,
        buildCaps({ hasCloudOptimisedData: true })
      )
    ).toBe(false);
  });
});

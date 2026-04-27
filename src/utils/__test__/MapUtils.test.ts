import { describe, expect, it, vi } from "vitest";
import { MapDefaultConfig } from "../../components/map/mapbox/constants";
import { OGCCollection } from "../../components/common/store/OGCCollectionDefinitions";
import {
  cssFontFamilyToMapboxTextFont,
  fitToBound,
  overallBoundingBox,
} from "../MapUtils";
import { FONT_FAMILIES } from "../../styles/fontsRC8";
import { Map as MapboxMap } from "mapbox-gl";

describe("MapUtils", () => {
  it("cssFontFamilyToMapboxTextFont maps Open Sans token stack to Mapbox glyphs", () => {
    expect(cssFontFamilyToMapboxTextFont(FONT_FAMILIES.openSans)).toEqual([
      "Open Sans Regular",
      "Arial Unicode MS Regular",
    ]);
    expect(
      cssFontFamilyToMapboxTextFont(FONT_FAMILIES.openSans, {
        fontWeight: 500,
      })
    ).toEqual(["Open Sans Semibold", "Arial Unicode MS Bold"]);
  });

  it("cssFontFamilyToMapboxTextFont maps Poppins token stack to Open Sans Mapbox glyphs", () => {
    expect(cssFontFamilyToMapboxTextFont(FONT_FAMILIES.poppins)).toEqual([
      "Open Sans Regular",
      "Arial Unicode MS Regular",
    ]);
  });

  it("cssFontFamilyToMapboxTextFont maps DIN substring to DIN Mapbox stack", () => {
    expect(cssFontFamilyToMapboxTextFont("DIN Offc Pro, sans-serif")).toEqual([
      "DIN Offc Pro Medium",
      "Arial Unicode MS Bold",
    ]);
  });

  it("cssFontFamilyToMapboxTextFont falls back when family unknown", () => {
    expect(cssFontFamilyToMapboxTextFont(undefined)).toEqual([
      "Open Sans Regular",
      "Arial Unicode MS Regular",
    ]);
    expect(cssFontFamilyToMapboxTextFont("Georgia, serif")).toEqual([
      "Open Sans Regular",
      "Arial Unicode MS Regular",
    ]);
  });

  it("returns default bounding box when collection is undefined", () => {
    const result = overallBoundingBox(undefined);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns default bounding box when extent is undefined", () => {
    const collection: OGCCollection = new OGCCollection();
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns default bounding box when bbox is undefined", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: {},
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns default bounding box when bbox[0] has fewer than 4 elements", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: { spatial: { bbox: [[1, 2, 3]] } },
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("returns bbox[0] when bbox is valid with 4 elements", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: { spatial: { bbox: [[10, 20, 30, 40]] } },
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([10, 20, 30, 40]);
  });

  it("returns bbox[0] when bbox has more than 4 elements", () => {
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      extent: { spatial: { bbox: [[10, 20, 30, 40, 50]] } },
    });
    const result = overallBoundingBox(collection);
    expect(result).toEqual([
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ]);
  });

  it("adjusts east > 180 by subtracting 360 for Pacific bbox", () => {
    const map = {
      resize: vi.fn(),
      cameraForBounds: vi.fn().mockReturnValue({ center: [0, 0], zoom: 5 }),
      flyTo: vi.fn(),
    } as unknown as MapboxMap;

    const bbox = [176, -72, 276, -48]; // crosses antimeridian

    fitToBound(map, bbox);

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [176, -72],
        [276 - 360, -48],
      ],
      expect.objectContaining({ padding: 20 })
    );
  });

  it("does not adjust when east <= 180", () => {
    const map = {
      resize: vi.fn(),
      cameraForBounds: vi.fn().mockReturnValue({ center: [0, 0], zoom: 5 }),
      flyTo: vi.fn(),
    } as unknown as MapboxMap;

    const bbox = [-10, -20, 30, 40];

    fitToBound(map, bbox);

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [-10, -20],
        [30, 40],
      ],
      expect.any(Object)
    );
  });
});

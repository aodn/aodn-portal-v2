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

  const createMockMap = () =>
    ({
      resize: vi.fn(),
      cameraForBounds: vi.fn().mockReturnValue({ center: [0, 0], zoom: 5 }),
      flyTo: vi.fn(),
    }) as unknown as MapboxMap;

  it("keeps east unchanged when it is greater than west", () => {
    const map = createMockMap();

    fitToBound(map, [176, -72, 276, -48]); // crosses antimeridian

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [176, -72],
        [276, -48],
      ],
      expect.objectContaining({ padding: 20 })
    );
  });

  it("adds 360 to east when it is smaller than west", () => {
    const map = createMockMap();

    fitToBound(map, [170, -40, -160, -10]); // crosses antimeridian

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [170, -40],
        [200, -10],
      ],
      expect.objectContaining({ padding: 20 })
    );
  });

  // centre of BBOX_ENDPOINTS, written out by hand on purpose
  const AUSTRALIA_CENTER = [133.5, -25.5];

  it("centred on Australia (but zoomed out to show most of world) for near-global bbox", () => {
    const map = createMockMap();

    fitToBound(map, [2, -68, 359, 79]); // 997c2e15-b345-438f-afac-49a4ac19be38

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [2, -68],
        [359, 79],
      ],
      expect.objectContaining({ padding: 20 })
    );
    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: AUSTRALIA_CENTER, zoom: 5 })
    );
  });

  it("centred on Australia (but zoomed out to show most of world) when lng span exceeds half the globe", () => {
    const map = createMockMap();

    fitToBound(map, [120, -78, 350, 38]); // 95d6314c-cfc7-40ae-b439-85f14541db71

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [120, -78],
        [350, 38],
      ],
      expect.objectContaining({ padding: 20 })
    );
    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: AUSTRALIA_CENTER })
    );
  });

  it("centred on Australia (but zoomed out to show most of world) for degenerate bbox with hemisphere lat span", () => {
    const map = createMockMap();

    fitToBound(map, [180, -71, 180, 63]); // ec2c0ef9-3645-4ded-b617-c8297f6eb250

    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: AUSTRALIA_CENTER })
    );
  });

  it("zoomed in to dataset, which is Australia (wide bbox keeps its own centre)", () => {
    const map = createMockMap();

    fitToBound(map, [80, -60, 179.9, 10]); // b35b829c-9149-46c6-9e25-d0fd03463280

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [80, -60],
        [179.9, 10],
      ],
      expect.objectContaining({ padding: 20 })
    );
    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [0, 0], zoom: 5 })
    );
  });

  it("zoomed in to dataset (tasmania)", () => {
    const map = createMockMap();

    fitToBound(map, [145, -44, 147.5, -40]); // 78d588ed-79dd-47e2-b806-d39025194e7e

    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [0, 0] })
    );
  });

  it("zoomed in to dataset (single point)", () => {
    const map = createMockMap();

    fitToBound(map, [-144.6333, -10.8833, -144.6333, -10.8833]); // 736fe6f0-8db6-11dc-92db-00008a07204e

    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [0, 0] })
    );
  });

  it("does not fly anywhere when cameraForBounds returns no camera", () => {
    const map = createMockMap();
    (map.cameraForBounds as ReturnType<typeof vi.fn>).mockReturnValue(
      undefined
    );

    fitToBound(map, [145, -44, 147.5, -40]);

    expect(map.flyTo).not.toHaveBeenCalled();
  });

  it("does not adjust when east <= 180", () => {
    const map = createMockMap();

    fitToBound(map, [-10, -20, 30, 40]);

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [-10, -20],
        [30, 40],
      ],
      expect.any(Object)
    );
  });
});

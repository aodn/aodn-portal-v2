import { describe, expect, it, vi } from "vitest";
import { MapDefaultConfig } from "../../components/map/mapbox/constants";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  cssFontFamilyToMapboxTextFont,
  fitToBound,
  fitToDefaultExtent,
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

  // lng of AUSTRALIA_BBOX_ENDPOINTS centre written out by hand on purpose;
  // lat is kept from cameraForBounds, which the mock returns as 0
  const RECENTRED = [133.5, 0];

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
      expect.objectContaining({ center: RECENTRED, zoom: 5 })
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
      expect.objectContaining({ center: RECENTRED })
    );
  });

  it("keeps own centre for degenerate bbox whose lng misses Australia (already looks practically right)", () => {
    const map = createMockMap();

    fitToBound(map, [180, -71, 180, 63]); // ec2c0ef9-3645-4ded-b617-c8297f6eb250

    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [0, 0] })
    );
  });

  it("keeps own centre for world-scale bbox that never reaches Australia", () => {
    const map = createMockMap();

    fitToBound(map, [-180, -60, 0, 60]); // atlantic hemisphere

    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [0, 0] })
    );
  });

  it("keeps computed lat when recentring, so high-latitude data stays in view", () => {
    const map = createMockMap();
    (map.cameraForBounds as ReturnType<typeof vi.fn>).mockReturnValue({
      center: [0, -67],
      zoom: 1,
    });

    fitToBound(map, [-180, -80, 180, -55]); // circumpolar southern ocean

    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [133.5, -67], zoom: 1 })
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

  it("caps zoom via baseZoom, which the location filter uses for its world view", () => {
    const map = createMockMap();

    fitToBound(map, [104, -43, 163, -8], { baseZoom: 0 });

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [104, -43],
        [163, -8],
      ],
      expect.objectContaining({ maxZoom: 0 })
    );
  });

  it("fitToDefaultExtent fits the collection's own extent, animated", () => {
    const map = createMockMap();
    const collection: OGCCollection = Object.assign(new OGCCollection(), {
      // 78d588ed-79dd-47e2-b806-d39025194e7e (tasmania)
      extent: { spatial: { bbox: [[145, -44, 147.5, -40]] } },
    });

    fitToDefaultExtent(map, collection);

    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [145, -44],
        [147.5, -40],
      ],
      expect.objectContaining({ padding: 20 })
    );
    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ animate: true })
    );
  });

  it("fitToDefaultExtent falls back to the default extent when collection is undefined", () => {
    const map = createMockMap();

    fitToDefaultExtent(map, undefined);

    // default extent corners written out by hand on purpose
    expect(map.cameraForBounds).toHaveBeenCalledWith(
      [
        [104, -43],
        [163, -8],
      ],
      expect.objectContaining({ padding: 20 })
    );
    expect(map.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ animate: true })
    );
  });
});

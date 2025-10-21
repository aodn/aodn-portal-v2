import { describe, expect, it } from "vitest";
import { MapDefaultConfig } from "../../components/map/mapbox/constants";
import { OGCCollection } from "../../components/common/store/OGCCollectionDefinitions";
import { overallBoundingBox } from "../MapUtils";

describe("MapUtils", () => {
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
});

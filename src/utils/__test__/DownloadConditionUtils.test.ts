import {
  getDateConditionFrom,
  getMultiPolygonFrom,
} from "../DownloadConditionUtils";
import {
  BBoxCondition,
  DateRangeCondition,
  IDownloadCondition,
} from "../../pages/detail-page/context/DownloadDefinitions";
import { MultiPolygon } from "geojson";
import { dateDefault } from "../../components/common/constants";
import dayjs from "dayjs";

describe("DownloadConditionUtils", () => {
  describe("getDateConditionFrom", () => {
    it("should return the date range condition if present", () => {
      const conditions: IDownloadCondition[] = [
        new DateRangeCondition("id1", "2023-01-01", "2023-12-31"),
      ];
      const result = getDateConditionFrom(conditions);
      expect(result).toEqual(conditions[0]);
    });

    it("should throw an error if multiple date range conditions are found", () => {
      const conditions: IDownloadCondition[] = [
        new DateRangeCondition("id1", "2023-01-01", "2023-12-31"),
        new DateRangeCondition("id2", "2024-01-01", "2024-12-31"),
      ];
      expect(() => getDateConditionFrom(conditions)).toThrow(
        "Multiple date range conditions found"
      );
    });

    it("should return the default date range condition if none is found", () => {
      const conditions: IDownloadCondition[] = [];
      const result = getDateConditionFrom(conditions);
      expect(result).toEqual(
        new DateRangeCondition(
          "defaultid",
          dayjs(dateDefault.min).format(dateDefault.DATE_FORMAT),
          dayjs(dateDefault.max).format(dateDefault.DATE_FORMAT)
        )
      );
    });
  });

  describe("getMultiPolygonFrom", () => {
    it("should return a MultiPolygon representing the whole world if no BBox condition is found", () => {
      const conditions: IDownloadCondition[] = [];
      const expected: MultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-180, 90],
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
            ],
          ],
        ],
      };
      const result = getMultiPolygonFrom(conditions);
      expect(result).toEqual(expected);
    });

    it("should return a MultiPolygon from the BBox conditions", () => {
      const conditions: IDownloadCondition[] = [
        new BBoxCondition("id1", [100.0, 0.0, 101.0, 1.0]),
        new BBoxCondition("id2", [102.0, 2.0, 103.0, 3.0]),
      ];
      const expected: MultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0],
            ],
          ],
          [
            [
              [102.0, 2.0],
              [103.0, 2.0],
              [103.0, 3.0],
              [102.0, 3.0],
              [102.0, 2.0],
            ],
          ],
        ],
      };
      const result = getMultiPolygonFrom(conditions);
      expect(result).toEqual(expected);
    });

    it("should throw an error if any BBox condition has an invalid bounding box", () => {
      const conditions: IDownloadCondition[] = [
        new BBoxCondition("id1", [100.0, 0.0, 101.0, 1.0, 0.0, 1.0]), // Invalid BBox
      ];
      expect(() => getMultiPolygonFrom(conditions)).toThrow(
        "Invalid bounding box"
      );
    });
  });
});

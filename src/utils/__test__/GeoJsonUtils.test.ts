import { combineBBoxesToMultiPolygon } from "../GeoJsonUtils";
import { MultiPolygon } from "geojson";

describe("combineBBoxesToMultiPolygon", () => {
  it("should combine multiple bounding boxes into a MultiPolygon", () => {
    const bboxes: [number, number, number, number][] = [
      [100.0, 0.0, 101.0, 1.0],
      [102.0, 2.0, 103.0, 3.0],
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
    const result = combineBBoxesToMultiPolygon(bboxes);
    expect(result).toEqual(expected);
  });

  it("should handle an empty array of bounding boxes", () => {
    const bboxes: [number, number, number, number][] = [];
    const expected: MultiPolygon = {
      type: "MultiPolygon",
      coordinates: [],
    };
    const result = combineBBoxesToMultiPolygon(bboxes);
    expect(result).toEqual(expected);
  });

  it("should handle a single bounding box", () => {
    const bboxes: [number, number, number, number][] = [
      [100.0, 0.0, 101.0, 1.0],
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
      ],
    };
    const result = combineBBoxesToMultiPolygon(bboxes);
    expect(result).toEqual(expected);
  });
});

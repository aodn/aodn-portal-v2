import {
  combineBBoxesToMultiPolygon,
  combineToMultiPolygon,
} from "../GeoJsonUtils";
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

describe("combineToMultiPolygon", () => {
  it("should combine bboxes and freeform polygons into one MultiPolygon", () => {
    const result = combineToMultiPolygon(
      [[100, 0, 101, 1]],
      [
        [
          [110, 10],
          [120, 10],
          [120, 20],
          [110, 10],
        ],
      ]
    );

    expect(result.type).toBe("MultiPolygon");
    expect(result.coordinates).toHaveLength(2);
  });

  it("should auto-close an unclosed polygon ring", () => {
    const unclosed: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 10],
    ];

    const result = combineToMultiPolygon([], [unclosed]);
    const ring = result.coordinates[0][0];

    expect(ring[ring.length - 1]).toEqual(ring[0]);
  });

  it("should not duplicate closing coord on an already-closed ring", () => {
    const closed: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 0],
    ];

    const result = combineToMultiPolygon([], [closed]);
    const ring = result.coordinates[0][0];

    expect(ring).toHaveLength(4);
    expect(ring).toEqual(closed);
  });

  it("should return empty coordinates when both inputs are empty", () => {
    const result = combineToMultiPolygon([], []);

    expect(result).toEqual({ type: "MultiPolygon", coordinates: [] });
  });
});

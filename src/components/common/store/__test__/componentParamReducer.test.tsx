import { describe, it, expect } from "vitest";
import * as turf from "@turf/turf";
import { formatToUrlParam, ParameterState } from "../componentParamReducer";

describe("Component Reducer Function Test", () => {
  it("Verify formatToUrlParam", () => {
    const sample1: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {},
      searchText: "",
    };

    const answer1: string = formatToUrlParam(sample1);
    expect(answer1).toEqual("isImosOnlyDataset=false&searchText=");

    const sample2: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {},
      searchText: "This is test",
    };

    const answer2: string = formatToUrlParam(sample2);
    expect(answer2).toEqual(
      "isImosOnlyDataset=false&searchText=This%20is%20test"
    );

    const sample3: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {
        start: 12345,
      },
      searchText: "This is test",
    };

    const answer3: string = formatToUrlParam(sample3);
    expect(answer3).toEqual(
      "isImosOnlyDataset=false&dateTimeFilterRange.start=12345&searchText=This%20is%20test"
    );

    const sample4: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {
        start: 12345,
        end: 45697,
      },
      searchText: "This is test",
      categories: [
        {
          label: "cat1",
          about: "about1",
        },
        {
          label: "cat1",
          about: "about1",
        },
      ],
    };

    const answer4: string = formatToUrlParam(sample4);
    expect(answer4).toEqual(
      "isImosOnlyDataset=false&dateTimeFilterRange.start=12345&dateTimeFilterRange.end=45697&searchText=This%20is%20test&categories.0.label=cat1&categories.1.label=cat1"
    );

    const sample5: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {
        start: 12345,
        end: 45697,
      },
      searchText: "This is test",
      categories: [
        {
          label: "cat1",
          about: "about1",
        },
        {
          label: "cat1",
          about: "about1",
        },
      ],
      polygon: turf.bboxPolygon([10, 20, -10.1, -20.0]),
    };

    const answer5: string = formatToUrlParam(sample5);
    expect(answer5).toEqual(
      "isImosOnlyDataset=false&dateTimeFilterRange.start=12345&dateTimeFilterRange.end=45697&searchText=This%20is%20test&categories.0.label=cat1&categories.1.label=cat1&polygon.type=Feature&polygon.bbox.0=10&polygon.bbox.1=20&polygon.bbox.2=-10.1&polygon.bbox.3=-20&polygon.geometry.type=Polygon&polygon.geometry.coordinates.0.0.0=10&polygon.geometry.coordinates.0.0.1=20&polygon.geometry.coordinates.0.1.0=-10.1&polygon.geometry.coordinates.0.1.1=20&polygon.geometry.coordinates.0.2.0=-10.1&polygon.geometry.coordinates.0.2.1=-20&polygon.geometry.coordinates.0.3.0=10&polygon.geometry.coordinates.0.3.1=-20&polygon.geometry.coordinates.0.4.0=10&polygon.geometry.coordinates.0.4.1=20"
    );
  });
});

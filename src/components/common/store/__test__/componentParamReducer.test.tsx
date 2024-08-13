import { describe, it, expect } from "vitest";
import {
  formatToUrlParam,
  unFlattenToParameterState,
  ParameterState,
} from "../componentParamReducer";

import { bboxPolygon } from "@turf/turf";

describe("Component Reducer Function Test", () => {
  it("Verify formatToUrlParam", () => {
    const sample1: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {},
      searchText: "",
    };

    const answer1: string = formatToUrlParam(sample1);
    expect(answer1).toEqual("isImosOnlyDataset=false");

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
          label: "cat2",
          about: "about2",
        },
      ],
      polygon: bboxPolygon([10, 20, -10.1, -20.0]),
    };

    const answer5: string = formatToUrlParam(sample5);
    expect(answer5).toEqual(
      "isImosOnlyDataset=false&dateTimeFilterRange.start=12345&dateTimeFilterRange.end=45697&searchText=This%20is%20test&categories.0.label=cat1&categories.1.label=cat2&polygon.type=Feature&polygon.bbox.0=10&polygon.bbox.1=20&polygon.bbox.2=-10.1&polygon.bbox.3=-20&polygon.geometry.type=Polygon&polygon.geometry.coordinates.0.0.0=10&polygon.geometry.coordinates.0.0.1=20&polygon.geometry.coordinates.0.1.0=-10.1&polygon.geometry.coordinates.0.1.1=20&polygon.geometry.coordinates.0.2.0=-10.1&polygon.geometry.coordinates.0.2.1=-20&polygon.geometry.coordinates.0.3.0=10&polygon.geometry.coordinates.0.3.1=-20&polygon.geometry.coordinates.0.4.0=10&polygon.geometry.coordinates.0.4.1=20"
    );
  });

  it("Verify unFlattenToParameterState", () => {
    const sample1: ParameterState = {
      isImosOnlyDataset: false,
      dateTimeFilterRange: {},
      searchText: "",
    };

    const answer1: string = formatToUrlParam(sample1);
    const objAnswer1: ParameterState = unFlattenToParameterState(answer1);
    expect(objAnswer1).toEqual(sample1);

    // Only label get export, other fields in category are volatile.
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
        },
        {
          label: "cat2",
        },
      ],
    };

    const answer4: string = formatToUrlParam(sample4);
    const objAnswer4: ParameterState = unFlattenToParameterState(answer4);
    expect(objAnswer4).toEqual(sample4);

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
        },
        {
          label: "cat2",
        },
      ],
      polygon: bboxPolygon([10, 20, -10.1, -20.0]),
    };

    console.debug(JSON.stringify(sample5, null, 2));

    const answer5: string = formatToUrlParam(sample5);
    const objAnswer5: ParameterState = unFlattenToParameterState(answer5);
    expect(objAnswer5).toEqual(sample5);
  });
});

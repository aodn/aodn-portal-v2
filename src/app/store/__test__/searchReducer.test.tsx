import { describe, it, expect } from "vitest";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { OGCCollection } from "@/app/api/ogcCollectionTypes";
import { DateTimeFilterRange, ParameterState } from "../searchParamsReducer";
import { createSearchParamFrom, SearchParameters } from "../searchReducer";
import dayjs from "dayjs";

describe("Search Reducer Function Test", () => {
  it("Empty links return default thumbnail", () => {
    const item = {
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: {},
    };

    const collection: OGCCollection = Object.assign(new OGCCollection(), item);
    expect(collection.findThumbnail()).toEqual(default_thumbnail);
  });

  it("Verify OGCCollection status is correct", () => {
    const item = {
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: { status: "completed" },
    };

    const collection: OGCCollection = Object.assign(new OGCCollection(), item);
    expect(collection.getStatus()).toEqual("completed");
  });

  it("Verify OGCCollection get scope correct", () => {
    const item = {
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: {
        status: "completed",
        scope: { code: "document", name: "test document collection" },
      },
    };

    const collection: OGCCollection = Object.assign(new OGCCollection(), item);
    expect(collection.getScope()).toEqual("document");
  });

  it("Verify OGCCollection get AI inferred update frequency correct", () => {
    const item = {
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: {
        "ai:update_frequency": "real-time",
      },
    };

    const collection: OGCCollection = Object.assign(new OGCCollection(), item);
    expect(collection.getAiUpdateFrequency()).toEqual("real-time");
  });

  it("Verify generate correct parameter on temperature", () => {
    // Simulate user type "tempeature" and select filter by "parameter"
    const parameterState: ParameterState = {
      searchText: "temperature",
      parameterVocabs: [
        {
          label: "temperature",
        },
      ],
    };

    const sp: SearchParameters = createSearchParamFrom(parameterState);
    expect(sp.text).equals("temperature");
    expect(sp.filter).contains(
      "(parameter_vocabs='temperature' OR ai_parameter_vocabs='temperature')"
    );
  });

  it("groups each selected parameter vocab with its AI parameter vocab", () => {
    const parameterState: ParameterState = {
      parameterVocabs: [{ label: "temperature" }, { label: "salinity" }],
    };

    const sp: SearchParameters = createSearchParamFrom(parameterState);

    expect(sp.filter).equals(
      "((parameter_vocabs='temperature' OR ai_parameter_vocabs='temperature') OR (parameter_vocabs='salinity' OR ai_parameter_vocabs='salinity'))"
    );
  });

  it("should exclude document scope when excludeDocument is true", () => {
    const param: ParameterState = {
      excludeDocument: true,
    };

    const result = createSearchParamFrom(param);

    expect(result.filter).toEqual("NOT (scope='document')");
  });

  it("should include both assets_summary and links_airole_contains filter when hasCOData is true", () => {
    const param: ParameterState = {
      hasCOData: true,
      dateTimeFilterRange: {},
      searchText: "",
    };

    const result = createSearchParamFrom(param);

    // Verify both CO data and download link filters are included with OR
    expect(result.filter).toContain("assets_summary IS NOT NULL");
    expect(result.filter).toContain("links_airole_contains='download'");
    expect(result.filter).toContain("OR");
    // Verify they are wrapped in parentheses as OR condition
    expect(result.filter).toContain(
      "(assets_summary IS NOT NULL) OR links_airole_contains='download'"
    );
  });
  // We need to make sure time is aware otherwise OGC api will throw exception where start = end exactly
  it("should include time in dateRange, start is 00:00:00 end is 23:59:59", () => {
    const param: ParameterState = {
      dateTimeFilterRange: {
        start: dayjs("2025-05-07T00:00:00").valueOf(),
        end: dayjs("2025-05-07T23:59:59").valueOf(),
      } as DateTimeFilterRange,
    };

    const result = createSearchParamFrom(param);

    // Verify both CO data and download link filters are included with OR
    expect(result.filter).toContain(
      "temporal DURING 2025-05-07T00:00:00Z/2025-05-07T23:59:59Z"
    );
  });
});

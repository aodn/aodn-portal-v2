import { describe, it, expect } from "vitest";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { OGCCollection } from "../OGCCollectionDefinitions";
import { ParameterState } from "../componentParamReducer";
import { createSearchParamFrom, SearchParameters } from "../searchReducer";

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
    expect(sp.filter).contains("(parameter_vocabs='temperature')");
  });
});

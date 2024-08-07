import { describe, it, expect } from "vitest";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { OGCCollection } from "../OGCCollectionDefinitions";

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
});

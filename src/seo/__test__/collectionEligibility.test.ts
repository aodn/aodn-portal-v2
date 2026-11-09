import { expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { isSeoEligibleCollection } from "@/seo/collectionEligibility";

test.each([
  [{}, true],
  [{ title: undefined }, false],
  [{ description: undefined }, false],
  [{ title: "" }, false],
  [{ description: " " }, false],
  [{ id: "" }, false],
  [{ id: undefined }, false],
  [{ id: "undefined" }, false],
  [{ id: "../invalid" }, false],
  [{ id: "." }, false],
  [{ id: ".." }, false],
])("SEO eligibility for %j is %s", (fields, eligible) => {
  const collection = Object.assign(
    new OGCCollection(),
    { id: "abc-123", title: "Title", description: "Description" },
    fields
  );
  expect(isSeoEligibleCollection(collection)).toBe(eligible);
});

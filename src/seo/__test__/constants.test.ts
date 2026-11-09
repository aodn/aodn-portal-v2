/**
 * SEO — a collection id is both a folder name under dist/prerender/details and
 * a URL path segment, so what it may contain decides whether a record reaches
 * Google at all. The two ids marked below were skipped and invisible to
 * crawlers until the filter was widened.
 */

import { describe, expect, test } from "vitest";
import { BASE_URL, detailsUrl, isSafeCollectionId } from "../constants";

const UUID = "009a1131-efc1-4a61-8f90-cf289e7c043d";
// Was skipped: brackets were outside the old allowlist
const BRACKETS = "AAS_4100_No_Effect_Concentration_(NEC)_methods";
// Was skipped: braces are not legal raw in a URL, so detailsUrl encodes them
const BRACES = "{0377A251-4E6C-48DF-95FC-720048F879B6}";

const allowed = [
  [UUID, "a uuid"],
  [BRACKETS, "brackets"],
  [BRACES, "braces"],
  ["ASAC_2201_HCL_0.5", "a dot inside"],
];

const rejected = [
  ["../../etc/passwd", "writes outside the output folder"],
  ["..", "writes outside the output folder"],
  [".", "is the output folder itself"],
  ["a/b", "adds a folder level"],
  ["a\\b", "adds a folder level on Windows"],
  ["a%2Fb", "is percent-encoded already"],
  ["undefined", "is the class default id"],
  ["", "is empty"],
];

describe("isSafeCollectionId", () => {
  allowed.forEach(([id, why]) => {
    test(`allows ${why}: ${id}`, () => {
      expect(isSafeCollectionId(id)).toBe(true);
    });
  });

  rejected.forEach(([id, why]) => {
    test(`rejects "${id}", it ${why}`, () => {
      expect(isSafeCollectionId(id)).toBe(false);
    });
  });

  test("rejects a missing id", () => {
    expect(isSafeCollectionId(undefined)).toBe(false);
  });
});

describe("detailsUrl", () => {
  test("encodes characters a URL path cannot carry raw", () => {
    expect(detailsUrl(BRACES)).toBe(
      `${BASE_URL}/details/%7B0377A251-4E6C-48DF-95FC-720048F879B6%7D`
    );
  });

  test("leaves uuids and brackets alone, so no published URL changes", () => {
    expect(detailsUrl(UUID)).toBe(`${BASE_URL}/details/${UUID}`);
    expect(detailsUrl(BRACKETS)).toBe(`${BASE_URL}/details/${BRACKETS}`);
  });

  test("the URL decodes back to the folder the page was written to", () => {
    const { pathname } = new URL(detailsUrl(BRACES));

    expect(decodeURIComponent(pathname)).toBe(`/details/${BRACES}`);
  });
});

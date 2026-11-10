import { describe, expect, it } from "vitest";
import {
  buildDataAccessUrl,
  getUsageConstraints,
  resolveSuggestedCitation,
} from "@/utils/CitationUtils";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { toAppDayjs } from "@/utils/DateUtils";

describe("buildDataAccessUrl", () => {
  it("points at the summary tab of the dataset's detail page", () => {
    expect(buildDataAccessUrl("009a1131-efc1-4a61-8f90-cf289e7c043d")).toBe(
      "http://localhost:3000/details/009a1131-efc1-4a61-8f90-cf289e7c043d?tab=summary"
    );
  });
});

describe("resolveSuggestedCitation", () => {
  const accessDate = toAppDayjs("2026-08-07");
  const uuid = "009a1131-efc1-4a61-8f90-cf289e7c043d";
  const title = "Australian Seagrass Occurence";

  it("replaces the year, title, access URL and access date placeholders", () => {
    const suggestedCitation =
      'The citation in a list of references is: "IMOS [year-of-data-download], [Title], [data-access-URL], accessed [date-of-access]."';

    expect(
      resolveSuggestedCitation(suggestedCitation, uuid, title, accessDate)
    ).toBe(
      'The citation in a list of references is: "IMOS 2026, Australian Seagrass Occurence, http://localhost:3000/details/009a1131-efc1-4a61-8f90-cf289e7c043d?tab=summary, accessed 07-Aug-2026."'
    );
  });

  it("handles the '[year-of-data-downloaded]' and lowercase URL placeholder variants", () => {
    const suggestedCitation =
      "IMOS [year-of-data-downloaded], [Title], [data-access-url], accessed [date-of-access]";

    expect(
      resolveSuggestedCitation(suggestedCitation, uuid, title, accessDate)
    ).toBe(
      "IMOS 2026, Australian Seagrass Occurence, http://localhost:3000/details/009a1131-efc1-4a61-8f90-cf289e7c043d?tab=summary, accessed 07-Aug-2026"
    );
  });

  it("returns an empty string when there is nothing to resolve", () => {
    expect(resolveSuggestedCitation(undefined, uuid, title, accessDate)).toBe(
      ""
    );
    expect(resolveSuggestedCitation("", uuid, title, accessDate)).toBe("");
  });

  it("leaves the access URL blank when no uuid is available", () => {
    expect(
      resolveSuggestedCitation(
        "[data-access-URL]",
        undefined,
        title,
        accessDate
      )
    ).toBe("");
  });

  it("leaves the title blank when no title is available", () => {
    expect(
      resolveSuggestedCitation("[Title]", uuid, undefined, accessDate)
    ).toBe("");
  });
});

describe("getUsageConstraints", () => {
  const createCollection = ({
    license,
    useLimitations,
    otherConstraints,
  }: {
    license?: string;
    useLimitations?: string[];
    otherConstraints?: string[];
  }) =>
    ({
      getLicense: () => license,
      getCitation: () => ({ useLimitations, otherConstraints }),
    }) as unknown as OGCCollection;

  it("lists use limitations first, then other constraints", () => {
    const collection = createCollection({
      useLimitations: ["Use limitation"],
      otherConstraints: ["Other constraint"],
    });

    expect(getUsageConstraints(collection)).toEqual([
      "Use limitation",
      "Other constraint",
    ]);
  });

  it("drops empty items, the licence text, and duplicates", () => {
    const collection = createCollection({
      license: "Creative Commons Attribution 4.0",
      useLimitations: [
        "",
        "  creative commons attribution 4.0  ",
        "Dataset constraint",
      ],
      otherConstraints: ["DATASET   CONSTRAINT"],
    });

    expect(getUsageConstraints(collection)).toEqual(["Dataset constraint"]);
  });

  it("returns an empty list when there are no constraints", () => {
    expect(getUsageConstraints(createCollection({}))).toEqual([]);
    expect(getUsageConstraints(undefined)).toEqual([]);
  });
});

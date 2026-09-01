import { describe, expect, it } from "vitest";
import { buildDataAccessUrl, resolveSuggestedCitation } from "../CitationUtils";
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

  it("replaces the year, access URL and access date placeholders", () => {
    const suggestedCitation =
      'The citation in a list of references is: "IMOS [year-of-data-download], Australian Seagrass Occurence, [data-access-URL], accessed [date-of-access]."';

    expect(resolveSuggestedCitation(suggestedCitation, uuid, accessDate)).toBe(
      'The citation in a list of references is: "IMOS 2026, Australian Seagrass Occurence, http://localhost:3000/details/009a1131-efc1-4a61-8f90-cf289e7c043d?tab=summary, accessed 07-Aug-2026."'
    );
  });

  it("handles the '[year-of-data-downloaded]' and lowercase URL placeholder variants", () => {
    const suggestedCitation =
      "IMOS [year-of-data-downloaded], [Title], [data-access-url], accessed [date-of-access]";

    expect(resolveSuggestedCitation(suggestedCitation, uuid, accessDate)).toBe(
      "IMOS 2026, [Title], http://localhost:3000/details/009a1131-efc1-4a61-8f90-cf289e7c043d?tab=summary, accessed 07-Aug-2026"
    );
  });

  it("returns an empty string when there is nothing to resolve", () => {
    expect(resolveSuggestedCitation(undefined, uuid, accessDate)).toBe("");
    expect(resolveSuggestedCitation("", uuid, accessDate)).toBe("");
  });

  it("leaves the access URL blank when no uuid is available", () => {
    expect(
      resolveSuggestedCitation("[data-access-URL]", undefined, accessDate)
    ).toBe("");
  });
});

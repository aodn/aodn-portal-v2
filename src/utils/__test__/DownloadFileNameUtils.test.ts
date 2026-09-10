import { describe, expect, it } from "vitest";
import {
  buildDownloadFileName,
  getDownloadFileExtension,
  sanitiseFileNamePart,
} from "../DownloadFileNameUtils";

describe("sanitiseFileNamePart", () => {
  it("replaces whitespace with underscores", () => {
    expect(sanitiseFileNamePart("IMOS - Argo Profiles")).toBe(
      "IMOS_-_Argo_Profiles"
    );
  });

  it("removes characters that are illegal in a file name", () => {
    expect(sanitiseFileNamePart('a/b\\c:d*e?f"g<h>i|j')).toBe("abcdefghij");
  });

  it("trims leading and trailing whitespace and dots", () => {
    expect(sanitiseFileNamePart("  ..Argo Profiles..  ")).toBe("Argo_Profiles");
  });

  it("falls back to a default when nothing usable is left", () => {
    expect(sanitiseFileNamePart(undefined)).toBe("download");
    expect(sanitiseFileNamePart("   ")).toBe("download");
    expect(sanitiseFileNamePart("///")).toBe("download");
  });
});

describe("getDownloadFileExtension", () => {
  it("maps the known WFS download formats", () => {
    expect(getDownloadFileExtension("text/csv")).toBe("csv");
    expect(getDownloadFileExtension("shape-zip")).toBe("zip");
    expect(getDownloadFileExtension("application/zip")).toBe("zip");
  });

  it("falls back to csv for an unknown or missing format", () => {
    expect(getDownloadFileExtension("something-else")).toBe("csv");
    expect(getDownloadFileExtension(undefined)).toBe("csv");
  });
});

describe("buildDownloadFileName", () => {
  const collectionTitle = "IMOS - Argo Profiles";

  it("uses the collection title alone when there is no dataset title", () => {
    expect(buildDownloadFileName({ collectionTitle, format: "text/csv" })).toBe(
      "IMOS_-_Argo_Profiles.csv"
    );
  });

  it("appends the dataset title when one is given", () => {
    expect(
      buildDownloadFileName({
        collectionTitle,
        datasetTitle: "Profile measurements",
        format: "text/csv",
      })
    ).toBe("IMOS_-_Argo_Profiles-Profile_measurements.csv");
  });

  it("uses the extension of the selected format", () => {
    expect(
      buildDownloadFileName({ collectionTitle, format: "shape-zip" })
    ).toBe("IMOS_-_Argo_Profiles.zip");
  });

  it("falls back to a default name when the collection title is missing", () => {
    expect(buildDownloadFileName({ format: "text/csv" })).toBe("download.csv");
  });
});

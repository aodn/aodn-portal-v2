import { describe, expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { buildJsonLd } from "../jsonLd";
import { BASE_URL } from "../constants";

const toCollection = (data: Record<string, unknown>) =>
  Object.assign(new OGCCollection(), data);

const collection = toCollection({
  id: "abc-123",
  title: "Sea Surface Temperature",
  description: "Daily SST observations around Australia.",
  extent: {
    spatial: { bbox: [[110, -45, 155, -10]] },
    temporal: { interval: [["2010-01-01T00:00:00Z", null]] },
  },
  properties: {
    themes: [
      { concepts: [{ id: "Oceans | Ocean Temperature" }, { id: "Oceans" }] },
    ],
    creation: "2017-04-27T00:00:00",
    revision: "2026-08-12T15:24:43",
  },
  providers: [{ name: "IMOS" }, { name: "IMOS" }, { name: "CSIRO" }],
});

describe("buildJsonLd", () => {
  test("maps the record to a schema.org Dataset", () => {
    expect(buildJsonLd(collection)).toEqual({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Sea Surface Temperature",
      description: "Daily SST observations around Australia.",
      url: `${BASE_URL}/details/abc-123`,
      identifier: "abc-123",
      // date only: the metadata timestamps carry no timezone
      datePublished: "2017-04-27",
      dateModified: "2026-08-12",
      keywords: ["Oceans | Ocean Temperature", "Oceans"],
      // duplicate provider names are collapsed
      creator: [
        { "@type": "Organization", name: "IMOS" },
        { "@type": "Organization", name: "CSIRO" },
      ],
      // schema.org GeoShape box is "south west north east"
      spatialCoverage: {
        "@type": "Place",
        geo: { "@type": "GeoShape", box: "-45 110 -10 155" },
      },
      // open-ended interval keeps ".." for the missing end
      temporalCoverage: "2010-01-01T00:00:00Z/..",
    });
  });

  test("omits optional fields the record does not have", () => {
    const jsonLd = buildJsonLd(
      toCollection({
        id: "abc-123",
        title: "Bare record",
        description: "No extent, themes or providers.",
      })
    );

    const serialized = JSON.stringify(jsonLd);
    expect(serialized).not.toContain("keywords");
    expect(serialized).not.toContain("creator");
    expect(serialized).not.toContain("spatialCoverage");
    expect(serialized).not.toContain("temporalCoverage");
    expect(serialized).not.toContain("datePublished");
    expect(serialized).not.toContain("dateModified");
    expect(serialized).not.toContain("null");
  });

  test("caps the description at 5000 characters", () => {
    const jsonLd = buildJsonLd(
      toCollection({
        id: "abc-123",
        title: "Long record",
        description: "x".repeat(6000),
      })
    );

    expect((jsonLd.description as string).length).toBe(5000);
  });
});

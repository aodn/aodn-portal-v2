import { describe, expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  browseUrl,
  groupByTheme,
  renderBrowsePage,
  toBrowseSlug,
} from "../browse";
import { BASE_URL } from "../constants";

const toCollection = (data: Record<string, unknown>) =>
  Object.assign(new OGCCollection(), data);

const record = (id: string, title: string, themeIds: string[] = []) =>
  toCollection({
    id,
    title,
    description: `About ${title}.`,
    properties: {
      themes: themeIds.length
        ? [{ scheme: "theme", concepts: themeIds.map((tid) => ({ id: tid })) }]
        : [],
    },
  });

describe("toBrowseSlug", () => {
  test("turns a concept id into a url-safe slug", () => {
    expect(toBrowseSlug("Oceans | Ocean Temperature")).toBe(
      "oceans-ocean-temperature"
    );
    expect(toBrowseSlug("Temperature of the water body")).toBe(
      "temperature-of-the-water-body"
    );
  });
});

describe("groupByTheme", () => {
  test("groups records by their theme-scheme concepts", () => {
    const groups = groupByTheme(
      [
        record("rec-1", "SST", ["Ocean Temperature"]),
        record("rec-2", "Moorings", ["Ocean Temperature", "Salinity"]),
      ],
      1
    );

    expect([...groups.keys()].sort()).toEqual([
      "ocean-temperature",
      "salinity",
    ]);
    expect(groups.get("ocean-temperature")?.records.map((r) => r.id)).toEqual([
      "rec-1",
      "rec-2",
    ]);
  });

  test("folds themes below the minimum into Other datasets", () => {
    const groups = groupByTheme([record("rec-1", "SST", ["Rare theme"])]);

    expect([...groups.keys()]).toEqual(["other-datasets"]);
    expect(groups.get("other-datasets")?.records.map((r) => r.id)).toEqual([
      "rec-1",
    ]);
  });

  test("does not duplicate a folded record already on a kept page", () => {
    const groups = groupByTheme([
      record("rec-1", "SST 1", ["Common", "Rare theme"]),
      record("rec-2", "SST 2", ["Common"]),
      record("rec-3", "SST 3", ["Common"]),
    ]);

    expect([...groups.keys()]).toEqual(["common"]);
  });

  test("ignores place-scheme concepts", () => {
    const collection = toCollection({
      id: "rec-1",
      title: "SST",
      description: "About SST.",
      properties: {
        themes: [{ scheme: "place", concepts: [{ id: "Bass Strait" }] }],
      },
    });

    expect([...groupByTheme([collection]).keys()]).toEqual(["other-datasets"]);
  });

  test("puts records without theme concepts on the fallback page", () => {
    const groups = groupByTheme([record("rec-1", "Bare record")]);
    expect([...groups.keys()]).toEqual(["other-datasets"]);
  });

  test("skips records that get no detail page, so links never 404", () => {
    const noDescription = toCollection({
      id: "rec-1",
      title: "No description",
    });
    expect(groupByTheme([noDescription]).size).toBe(0);
  });
});

describe("renderBrowsePage", () => {
  test("lists a crawlable link per record with canonical and description", () => {
    const html = renderBrowsePage("Ocean Temperature", [
      record("rec-1", "SST", ["Ocean Temperature"]),
    ]);

    expect(html).toContain(`<a href="${BASE_URL}/details/rec-1">SST</a>`);
    expect(html).toContain("<title>Ocean Temperature | AODN Portal</title>");
    expect(html).toContain(
      `<link rel="canonical" href="${browseUrl("ocean-temperature")}" />`
    );
    expect(html).toContain(
      '<meta name="description" content="1 Ocean Temperature datasets'
    );
  });

  test("escapes record titles from the metadata", () => {
    const html = renderBrowsePage("Ocean Temperature", [
      record("rec-1", 'SST <"hot" & cold>', ["Ocean Temperature"]),
    ]);

    expect(html).toContain("SST &#60;&#34;hot&#34; &#38; cold&#62;");
    expect(html).not.toContain('<"hot"');
  });
});

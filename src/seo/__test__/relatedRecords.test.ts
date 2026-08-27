import { describe, expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { buildRelatedLinks } from "../relatedRecords";

const toCollection = (id: string, conceptIds: string[]) =>
  Object.assign(new OGCCollection(), {
    id,
    title: `Title ${id}`,
    properties: {
      themes: [{ concepts: conceptIds.map((concept) => ({ id: concept })) }],
    },
  });

const idsOf = (links?: { id: string }[]) => links?.map((link) => link.id);

describe("buildRelatedLinks", () => {
  test("prefers the rarest shared concept and never links a record to itself", () => {
    const related = buildRelatedLinks(
      [
        toCollection("a", ["rare", "common"]),
        toCollection("b", ["common"]),
        toCollection("c", ["rare", "common"]),
        toCollection("d", ["common"]),
      ],
      2
    );

    // c first via the 2-member "rare" bucket, then b from "common"; never a itself
    expect(idsOf(related.get("a"))).toEqual(["c", "b"]);
    expect(related.get("a")![0].title).toBe("Title c");
  });

  test("walks a shared bucket cyclically so incoming links spread evenly", () => {
    const related = buildRelatedLinks(
      ["a", "b", "c", "d"].map((id) => toCollection(id, ["common"])),
      1
    );

    expect(idsOf(related.get("a"))).toEqual(["b"]);
    expect(idsOf(related.get("b"))).toEqual(["c"]);
    expect(idsOf(related.get("c"))).toEqual(["d"]);
    expect(idsOf(related.get("d"))).toEqual(["a"]);
  });

  test("caps at maxLinks (default 8)", () => {
    const many = Array.from({ length: 12 }, (_, i) =>
      toCollection(`record-${i}`, ["shared"])
    );

    expect(buildRelatedLinks(many).get("record-0")).toHaveLength(8);
  });

  test("returns no links for a record sharing no concepts", () => {
    const related = buildRelatedLinks([
      toCollection("a", ["only-mine"]),
      toCollection("b", []),
      toCollection("c", ["common"]),
      toCollection("d", ["common"]),
    ]);

    expect(related.get("a")).toEqual([]);
    expect(related.get("b")).toEqual([]);
  });
});

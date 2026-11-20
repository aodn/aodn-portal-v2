import { describe, expect, it } from "vitest";
import { SearchKeys } from "@/components/search/constants";
import {
  NEWS_CARDS_DATA,
  getFeaturedGroup,
  getNewsCards,
} from "@/pages/landing-page/features/news/constants";

const imosCard = { ...NEWS_CARDS_DATA[0], id: 1, tab: SearchKeys.IMOS };
const aadCard = { ...NEWS_CARDS_DATA[0], id: 2, tab: SearchKeys.AAD };
const mixedCards = [imosCard, aadCard];

describe("getFeaturedGroup", () => {
  it.each([
    ["IMOS", SearchKeys.IMOS],
    ["aad", SearchKeys.AAD],
    ["Aad", SearchKeys.AAD],
  ])("reads %s as %s when the tab has cards", (value, group) => {
    expect(getFeaturedGroup(value, mixedCards)).toBe(group);
  });

  it.each([null, "", "unknown", "wamsi"])("ignores %s", (value) => {
    expect(getFeaturedGroup(value, mixedCards)).toBeUndefined();
  });

  it("ignores a known organisation without cards", () => {
    expect(getFeaturedGroup("AAD")).toBeUndefined();
    expect(getFeaturedGroup("IMOS")).toBe(SearchKeys.IMOS);
  });

  it.each(["aims", "WAMSI", "eAtlas", "ga"])(
    "opens %s, which has cards",
    (value) => {
      expect(getFeaturedGroup(value)).toBe(value.toLowerCase());
    }
  );
});

describe("getNewsCards", () => {
  it("gives every card a tab", () => {
    NEWS_CARDS_DATA.forEach((card) => {
      expect(Object.values(SearchKeys)).toContain(card.tab);
    });
  });

  it("returns only the cards of the tab", () => {
    expect(getNewsCards(SearchKeys.AAD, mixedCards)).toEqual([aadCard]);
    expect(getNewsCards(SearchKeys.IMOS, mixedCards)).toEqual([imosCard]);
  });

  it("returns no cards for a tab without content", () => {
    expect(getNewsCards(SearchKeys.NCI)).toEqual([]);
  });

  it("has unique card ids", () => {
    const ids = NEWS_CARDS_DATA.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each([
    [SearchKeys.IMOS, 3],
    [SearchKeys.AIMS, 3],
    [SearchKeys.WAMSI, 3],
    [SearchKeys.EATLAS, 3],
    [SearchKeys.GA, 3],
  ])("has the featured datasets of %s", (tab, count) => {
    const cards = getNewsCards(tab);
    expect(cards).toHaveLength(count);
    cards.forEach((card) => {
      expect(card.link).toMatch(/\/details\/[\w-]+\?tab=summary$/);
    });
  });
});

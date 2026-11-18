import { describe, expect, it } from "vitest";
import { SearchKeys } from "@/components/search/constants";
import {
  NEWS_CARDS_DATA,
  getFeaturedGroup,
  getNewsCards,
} from "@/pages/landing-page/features/news/constants";

describe("getFeaturedGroup", () => {
  it.each([
    ["IMOS", SearchKeys.IMOS],
    ["aad", SearchKeys.AAD],
    ["AIMS", SearchKeys.AIMS],
    ["Csiro", SearchKeys.CSIRO],
    ["IMAS", SearchKeys.IMAS],
  ])("reads %s as %s", (value, group) => {
    expect(getFeaturedGroup(value)).toBe(group);
  });

  it.each([null, "", "unknown", "ga"])("ignores %s", (value) => {
    expect(getFeaturedGroup(value)).toBeUndefined();
  });
});

describe("getNewsCards", () => {
  it("gives every card a tab", () => {
    NEWS_CARDS_DATA.forEach((card) => {
      expect(Object.values(SearchKeys)).toContain(card.tab);
    });
  });

  it("returns only the cards of the tab", () => {
    const imosCard = { ...NEWS_CARDS_DATA[0], id: 1, tab: SearchKeys.IMOS };
    const aadCard = { ...NEWS_CARDS_DATA[0], id: 2, tab: SearchKeys.AAD };
    expect(getNewsCards(SearchKeys.AAD, [imosCard, aadCard])).toEqual([
      aadCard,
    ]);
    expect(getNewsCards(SearchKeys.IMOS, [imosCard, aadCard])).toEqual([
      imosCard,
    ]);
  });

  it("returns the IMOS cards for a tab without cards yet", () => {
    expect(getNewsCards(SearchKeys.AAD)).toEqual(getNewsCards(SearchKeys.IMOS));
  });
});

import { http, HttpResponse } from "msw";
import { PARAMETER_CATEGORIES } from "./data/PARAMETER_CATEGORIES";
import { SUGGESTER_OPTIONS } from "./data/SUGGESTER_OPTIONS";
import { COLLECTIONS_WAVE } from "./data/COLLECTIONS_WAVE";

const PREFIX = "/api/v1/ogc";

export const handlers = [
  http.get(PREFIX + "/ext/parameter/categories", () => {
    console.log("Called /ext/parameter/categories");
    return HttpResponse.json(PARAMETER_CATEGORIES);
  }),

  http.get(PREFIX + "/ext/autocomplete", ({ request }) => {
    console.log("Called /ext/autocomplete");
    const url = new URL(request.url);
    const input = url.searchParams.getAll("input");
    const filters = url.searchParams.getAll("filter");
    if (input.length != 1) {
      return HttpResponse.json(
        { error: `Found ${input.length}input(s), but except 1` },
        { status: 400 }
      );
    }

    return HttpResponse.json(getSuggesterOptionsBy(input[0], filters));
  }),

  http.get(PREFIX + "/collections", ({ request }) => {
    console.log(`Called ${request.url}`);
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    if (q === "wave" || q === null) {
      // For simplify current test usage, return wave result only for now. May need to update in the future
      return HttpResponse.json(COLLECTIONS_WAVE);
    }
  }),
];

const getSuggesterOptionsBy = (input: string, filter: string[]) => {
  const allCategories = SUGGESTER_OPTIONS.category_suggestions;
  const allTitles = SUGGESTER_OPTIONS.record_suggestions.titles;

  const categories = filterItemsIn(allCategories).by(input.toLowerCase());
  const titles = filterItemsIn(allTitles).by(input.toLowerCase());
  return {
    category_suggestions: categories,
    record_suggestions: {
      titles: titles,
    },
  };
};

const filterItemsIn = (array: string[]) => {
  return new ArrayToFilter(array);
};

class ArrayToFilter {
  constructor(private readonly array: string[]) {}

  public by(keyword: string) {
    return this.array.filter((item) => item.toLowerCase().includes(keyword));
  }
}

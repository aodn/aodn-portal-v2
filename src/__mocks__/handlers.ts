import { http, HttpResponse } from "msw";
import { PARAMETER_CATEGORIES } from "./data/PARAMETER_CATEGORIES";
import { SUGGESTER_OPTIONS } from "./data/SUGGESTER_OPTIONS";

export const handlers = [
  http.get("/api/v1/ogc/ext/parameter/categories", () => {
    return HttpResponse.json(PARAMETER_CATEGORIES);
  }),

  http.get("/api/v1/ogc/ext/autocomplete", ({ request }) => {
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

import { http, HttpResponse } from "msw";
import { parameterCategories } from "./data/parameterCategories.ts";
import { suggesterOptions } from "./data/suggesterOptions.ts";

export const handlers = [
  http.get("/api/v1/ogc/ext/parameter/categories", (a) => {
    const b = a;
    return HttpResponse.json(parameterCategories);
  }),

  http.get("/api/v1/ogc/ext/autocomplete", ({ request }) => {
    const url = new URL(request.url);
    const input = url.searchParams.getAll("input");
    const filters = url.searchParams.getAll("filter");
    if (input.length != 1) {
      return HttpResponse.json(null, { status: 400 });
    }

    const a = getSuggesterOptionsBy(input[0], filters);
    return HttpResponse.json(a);
  }),
];

const getSuggesterOptionsBy = (input: string, filter: string[]) => {
  const categories = suggesterOptions.category_suggestions.filter((c) =>
    c.toLowerCase().includes(input.toLowerCase())
  );
  const titles = suggesterOptions.record_suggestions.titles.filter((t) =>
    t.toLowerCase().includes(input.toLowerCase())
  );
  return {
    category_suggestions: categories,
    record_suggestions: {
      titles: titles,
    },
  };
};

import { http, HttpResponse } from "msw";
import { PARAMETER_CATEGORIES } from "./data/PARAMETER_CATEGORIES";
import { COLLECTIONS_WAVE } from "./data/COLLECTIONS_WAVE";
import { getSuggesterOptionsBy } from "./utils/SuggesterHandlerUtils";
import { NORMAL_COLLECTION } from "./data/COLLECTIONS";

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

  http.get(PREFIX + "/collections/:uuid", ({ params }) => {
    const { uuid } = params;

    // TODO: if more mocked records are needed, implementation here will change
    if (uuid === NORMAL_COLLECTION.id) {
      return HttpResponse.json(NORMAL_COLLECTION);
    }
  }),
];

import { http, HttpResponse } from "msw";
import { PARAMETER_VOCABS } from "./data/PARAMETER_VOCABS";
import { COLLECTIONS_WAVE } from "./data/COLLECTIONS_WAVE";
import { getSuggesterOptionsBy } from "./utils/SuggesterHandlerUtils";
import { NORMAL_COLLECTION } from "./data/COLLECTIONS";
import {
  emptyAboutInfo,
  emptyAssociatedRecordInfo,
  emptyCitationInfo,
  emptyLineageInfo,
  emptyMetadataInfo,
} from "./utils/DataModificationUtils";

const PREFIX = "/api/v1/ogc";

export const handlers = [
  http.get(PREFIX + "/ext/parameter/vocabs", () => {
    console.log("Called /ext/parameter/vocabs");
    return HttpResponse.json(PARAMETER_VOCABS);
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

    if (uuid === NORMAL_COLLECTION.id) {
      return HttpResponse.json(NORMAL_COLLECTION);
    }

    if (uuid == NORMAL_COLLECTION.id + "emptyabout") {
      return HttpResponse.json(emptyAboutInfo(NORMAL_COLLECTION));
    }

    if (uuid == NORMAL_COLLECTION.id + "emptymetadata") {
      return HttpResponse.json(emptyMetadataInfo(NORMAL_COLLECTION));
    }

    if (uuid == NORMAL_COLLECTION.id + "emptycitation") {
      return HttpResponse.json(emptyCitationInfo(NORMAL_COLLECTION));
    }

    if (uuid == NORMAL_COLLECTION.id + "emptylineage") {
      return HttpResponse.json(emptyLineageInfo(NORMAL_COLLECTION));
    }

    if (uuid == NORMAL_COLLECTION.id + "emptyassociatedrecords") {
      return HttpResponse.json(emptyAssociatedRecordInfo(NORMAL_COLLECTION));
    }

    return HttpResponse.json(
      {
        error: `Intercepted a request about getting the collection of uuid: ${uuid}, but didn't handled in mocked api.`,
      },
      { status: 404 }
    );
  }),
];

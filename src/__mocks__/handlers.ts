import { http, HttpResponse } from "msw";
import { PARAMETER_VOCABS } from "./data/PARAMETER_VOCABS";
import { COLLECTIONS_WAVE } from "./data/COLLECTIONS_WAVE";
import { COLLECTIONS_MALFORM_RELATED } from "./data/COLLECTIONS_MALFORM_RELATED";
import { COLLECTIONS_ITEM_SUMMARY } from "./data/COLLECTIONS_ITEM_SUMMARY";
import {
  COLLECTIONS_IMOS_PAGE1,
  COLLECTIONS_IMOS_PAGE2,
} from "./data/COLLECTIONS_IMOS";
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

    if (Array.isArray(input) ? input.includes("wave") : input === "wave") {
      return HttpResponse.json(getSuggesterOptionsBy(input[0], filters));
    } else if (Array.isArray(input) ? input.includes("imo") : input === "imo") {
      // If user type imo, then need to give this suggestion list
      return HttpResponse.json({
        suggested_organisation_vocabs: [
          "Expendable Bathythermograph Sub-Facility, Integrated Marine Observing System (IMOS)",
          "Ocean Radar Facility, Integrated Marine Observing System (IMOS)",
          "Sea Surface Temperature Products Sub-Facility, Integrated Marine Observing System (IMOS)",
          "Southern Ocean Time Series Observatory Sub-Facility, Integrated Marine Observing System (IMOS)",
          "Integrated Marine Observing System (IMOS)",
        ],
        suggested_platform_vocabs: [],
        suggested_phrases: [
          "imos indonsian throughflow",
          "rv southern surveyor imos",
          "former imos ship",
          "watch imos platform code",
          "surveyor imos platform",
          "marine observing system imos",
          "timor north",
          "imos platform code vlhj",
          "imos indonsian",
          "imos sst",
          "imos sst products web",
          "coffs harbour where imos",
          "southern surveyor imos",
          "surveyor imos platform code",
          "timor passage throughflow components",
          "imos platform",
          "imos platform code fhzi",
          "system imos",
          "timor passage throughflow",
          "imos funded",
          "imos platform code",
          "observing system imos",
          "timor north deep",
          "imos indonsian throughflow moorings",
          "imos ships",
          "imos ship",
          "timor",
          "system imos funded",
          "harbour where imos",
          "watch imos platform",
          "southern surveyor imos platform",
          "timor passage",
          "former imos",
          "watch imos",
          "surveyor imos",
          "timor north deep water",
          "where imos",
          "observing system imos funded",
          "imos sst products",
        ],
        suggested_parameter_vocabs: [],
      });
    } else {
      return HttpResponse.json({});
    }
  }),

  http.get(PREFIX + "/collections", ({ request }) => {
    console.log(`Called ${request.url}`);
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const search_after = url.searchParams.get("search_after");
    if (q === "wave" || q === null) {
      // For simplify current test usage, return wave result only for now. May need to update in the future
      return HttpResponse.json(COLLECTIONS_WAVE);
    } else if (q === "imos" && search_after === null) {
      // Search word imos for first page
      return HttpResponse.json(COLLECTIONS_IMOS_PAGE1);
    } else if (
      q === "imos" &&
      search_after === "8.631659,c1344e70-480e-0993-e044-00144f7bc0f4"
    ) {
      return HttpResponse.json(COLLECTIONS_IMOS_PAGE2);
    }
  }),

  http.get(PREFIX + "/collections/:uuid", ({ params }) => {
    const { uuid } = params;

    if (uuid === NORMAL_COLLECTION.id) {
      return HttpResponse.json(NORMAL_COLLECTION);
    }

    if (uuid === COLLECTIONS_MALFORM_RELATED.id) {
      return HttpResponse.json(COLLECTIONS_MALFORM_RELATED);
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

  http.get(PREFIX + "/collections/:uuid/items/summary", ({ params }) => {
    const { uuid } = params;
    // return empty FeatureCollection<Point> for now
    if (uuid == NORMAL_COLLECTION.id) {
      return HttpResponse.json(COLLECTIONS_ITEM_SUMMARY);
    }

    return HttpResponse.json({
      type: "FeatureCollection",
      features: [],
    });
  }),
];

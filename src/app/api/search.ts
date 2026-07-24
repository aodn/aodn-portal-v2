/**
 * Search and discovery requests: collection search, autocomplete
 * suggestions and the parameter vocab list.
 *
 * Every function returns response data and throws a normalized
 * ErrorResponse on HTTP failure. Optional AbortSignal to cancel.
 */
import { ogcAxiosWithRetry, TIMEOUT, toErrorResponse } from "./httpClient";
import {
  OGCSearchParameters,
  SearchParameters,
  SuggesterParameters,
} from "./searchQueryBuilder";
import { Vocab } from "@/app/store/searchParamsReducer";
import { OGCCollection } from "@/app/api/ogcCollectionTypes";

// Map the UI-facing SearchParameters onto what the endpoint accepts.
const toOGCSearchParams = (param: SearchParameters): OGCSearchParameters => {
  const p: OGCSearchParameters = {
    properties:
      param.properties !== undefined
        ? param.properties
        : // Including the keyword "bbox" to ensure spatial extents is returned
          "id,title,description,status,scope,ai_update_frequency,links,assets_summary,bbox",
  };
  if (param.text !== undefined && param.text.length !== 0) {
    p.q = param.text;
  }
  // DO NOT EXPOSE score externally, you should not allow share
  // url with score, alter UI behavior which is hard to control
  if (param.filter !== undefined && param.filter.length !== 0) {
    p.filter = param.filter;
  }
  if (param.sortby !== undefined && param.sortby.length !== 0) {
    p.sortby = param.sortby;
  }
  return p;
};

export const getCollections = (param: SearchParameters, signal?: AbortSignal) =>
  ogcAxiosWithRetry
    .get<string>("/ogc/collections", {
      params: toOGCSearchParams(param),
      timeout: TIMEOUT,
      signal,
    })
    .then((response) => response.data)
    .catch(toErrorResponse);

export const getCollectionById = (id: string) =>
  ogcAxiosWithRetry
    .get<OGCCollection>(`/ogc/collections/${id}`)
    .then((response) => Object.assign(new OGCCollection(), response.data))
    .catch(toErrorResponse);

export const getAutocomplete = (params: SuggesterParameters) =>
  ogcAxiosWithRetry
    .get<any>("/ogc/ext/autocomplete", { params, timeout: TIMEOUT })
    .then((response) => response.data)
    .catch(toErrorResponse);

export const getParameterVocabs = () =>
  ogcAxiosWithRetry
    .get<Array<Vocab>>("/ogc/ext/parameter/vocabs", { timeout: TIMEOUT })
    .then((response) => response.data)
    .catch(toErrorResponse);

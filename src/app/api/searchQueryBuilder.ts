/**
 * Builds the REST query parameters for the OGC search endpoints from the
 * UI parameter state. Pure functions only — no HTTP, no Redux.
 */
import { ParameterState } from "@/app/store/searchParamsReducer";
import { cqlFilters } from "@/components/common/cqlFilters";
import { mergeWithDefaults } from "@/utils/ObjectUtils";

export type SuggesterParameters = {
  input?: string;
  filter?: string;
};

// The parameter shape the OGC endpoint actually accepts.
export type OGCSearchParameters = {
  q?: string;
  filter?: string;
  properties?: string;
  sortby?: string;
};

export type SearchParameters = {
  text?: string;
  filter?: string;
  properties?: string;
  sortby?: string;
};
// Control the behavior of search behavior not part of the query
export type SearchControl = {
  pagesize?: number;
  searchafter?: Array<string>;
  score?: number;
};

const DEFAULT_SEARCH_SCORE = import.meta.env.VITE_ELASTIC_RELEVANCE_SCORE;

/**
 * Appends a filter condition using AND operation.
 */
const appendFilter = (
  f: string | undefined,
  a: string | undefined
): string | undefined => (f === undefined ? a : f + " AND " + a);

const createSuggesterParamFrom = (
  paramState: ParameterState
): SuggesterParameters => {
  const suggesterParam: SuggesterParameters = {};
  suggesterParam.input = paramState.searchText ? paramState.searchText : "";
  if (paramState.parameterVocabs) {
    suggesterParam.filter = cqlFilters.parameterVocabsIn(
      paramState.parameterVocabs
    );
  }
  return suggesterParam;
};
// The longer the text user query, there higher the score it require, this makes sense
// because user make specific query and result should be specific too.
// const calculateScore = (
//   base: number | undefined,
//   text: string | undefined
// ): number => {
//   const pump = text ? (text.length / 2 > 50 ? 50 : text.length / 2) : 0;
//   return base ? Number(base) + Number(pump) : Number(pump);
// };

// Given a ParameterState object, we convert it to the correct Restful parameters
// always call this function and do not handcraft it elsewhere, some control isn't
// part the ParameterState and therefore express as optional argument here
const createSearchParamFrom = (
  paramState: ParameterState,
  control?: SearchControl
): SearchParameters => {
  const result: SearchParameters = {};
  result.sortby = paramState.sortby;
  result.text = paramState.searchText;

  const mergedControl = mergeWithDefaults<SearchControl>(
    {
      score: DEFAULT_SEARCH_SCORE,
    },
    control
  );

  // The score control how relevant the records
  // ! DO NO USE SCORE !, it will cause no result in some case because
  // some text search only hit the filter which cause score become null
  // if you set score you got nothing.
  // result.filter = `score>=${calculateScore(mergedControl.score, result.text)}`;

  // Control how many record return in 1 page.
  if (mergedControl.pagesize) {
    result.filter = appendFilter(
      result.filter,
      `page_size=${mergedControl.pagesize}`
    );
  }

  if (mergedControl.searchafter) {
    result.filter = appendFilter(
      result.filter,
      `search_after='${mergedControl.searchafter.join("||")}'`
    );
  }

  if (paramState.datasetGroup) {
    result.filter = appendFilter(
      result.filter,
      cqlFilters.datasetGroup(paramState.datasetGroup)
    );
  }

  if (paramState.hasCOData) {
    // Filter records that have cloud optimized data OR have a downloadable link
    const coDataFilter = cqlFilters.isNotNull("assets_summary");
    const downloadLinkFilter = "links_airole_contains='download'";
    result.filter = appendFilter(
      result.filter,
      `(${coDataFilter} OR ${downloadLinkFilter})`
    );
  }

  if (paramState.excludeDocument) {
    result.filter = appendFilter(
      result.filter,
      cqlFilters.excludeDatasetScope("document")
    );
  }

  if (paramState.updateFreq) {
    result.filter = appendFilter(
      result.filter,
      cqlFilters.updateFrequency(paramState.updateFreq)
    );
  }

  if (paramState.datasetStatus) {
    result.filter = appendFilter(
      result.filter,
      cqlFilters.status(paramState.datasetStatus)
    );
  }

  const { start, end } = paramState.dateTimeFilterRange ?? {};
  if (start || end) {
    if (start && end) {
      result.filter = appendFilter(
        result.filter,
        cqlFilters.betweenTimeRange(start, end)
      );
    } else if (start === undefined && end) {
      result.filter = appendFilter(result.filter, cqlFilters.beforeTime(end));
    } else if (end === undefined && start) {
      result.filter = appendFilter(result.filter, cqlFilters.afterTime(start));
    }
  }

  if (paramState.bbox) {
    const buildBBoxFilter = paramState.includeNoGeometry
      ? cqlFilters.bboxPolygonOrEmptyExtents
      : cqlFilters.bboxPolygon;
    result.filter = appendFilter(
      result.filter,
      buildBBoxFilter(paramState.bbox)
    );
  }

  let spatialFilter: string | undefined;

  if (paramState.staticAreas && paramState.staticAreas.length > 0) {
    spatialFilter = cqlFilters.staticAreas(paramState.staticAreas);
  }

  if (paramState.polygon) {
    const polygonFilter = cqlFilters.intersectPolygon(paramState.polygon);
    spatialFilter = spatialFilter
      ? `(${spatialFilter} OR ${polygonFilter})`
      : polygonFilter;
  }

  if (spatialFilter) {
    result.filter = appendFilter(result.filter, spatialFilter);
  }

  if (paramState.parameterVocabs && paramState.parameterVocabs.length > 0) {
    const parameterVocabFilter = cqlFilters.parameterVocabsIn(
      paramState.parameterVocabs
    );
    if (parameterVocabFilter) {
      result.filter = appendFilter(result.filter, parameterVocabFilter);
    }
  }

  if (paramState.platform && paramState.platform.length > 0) {
    result.filter = appendFilter(
      result.filter,
      cqlFilters.platformFilter(paramState.platform)
    );
  }

  return result;
};

export { createSuggesterParamFrom, createSearchParamFrom };

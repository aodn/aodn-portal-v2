/**
 * Builds the REST query parameters for the OGC search endpoints from the
 * UI parameter state. Pure functions only — no HTTP, no Redux.
 */
import { ParameterState } from "@/app/store/searchParamsReducer";
import {
  cqlDefaultFilters,
  DatasetGroup,
  IsNotNull,
  ParameterVocabsIn,
  PlatformFilter,
  PolygonOperation,
  TemporalAfterOrBefore,
  TemporalDuring,
  UpdateFrequency,
  Status,
  StaticAreasFilter,
  ExcludeDatasetScope,
} from "@/components/common/cqlFilters";
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
    const filterGenerator = cqlDefaultFilters.get(
      "PARAMETER_VOCABS_IN"
    ) as ParameterVocabsIn;
    suggesterParam.filter = filterGenerator(paramState.parameterVocabs);
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
    const f = cqlDefaultFilters.get("DATASET_GROUP") as DatasetGroup;
    result.filter = appendFilter(result.filter, f(paramState.datasetGroup));
  }

  if (paramState.hasCOData) {
    // Filter records that have cloud optimized data OR have a downloadable link
    const coDataFilter = (cqlDefaultFilters.get("IS_NOT_NULL") as IsNotNull)(
      "assets_summary"
    );
    const downloadLinkFilter = "links_airole_contains='download'";
    result.filter = appendFilter(
      result.filter,
      `(${coDataFilter} OR ${downloadLinkFilter})`
    );
  }

  if (paramState.excludeDocument) {
    const f = cqlDefaultFilters.get(
      "EXCLUDE_DATASET_SCOPE"
    ) as ExcludeDatasetScope;
    result.filter = appendFilter(result.filter, f("document"));
  }

  if (paramState.updateFreq) {
    const f = cqlDefaultFilters.get("UPDATE_FREQUENCY") as UpdateFrequency;
    result.filter = appendFilter(result.filter, f(paramState.updateFreq));
  }

  if (paramState.datasetStatus) {
    const f = cqlDefaultFilters.get("STATUS") as Status;
    result.filter = appendFilter(result.filter, f(paramState.datasetStatus));
  }

  if (
    paramState.dateTimeFilterRange &&
    (paramState.dateTimeFilterRange.start || paramState.dateTimeFilterRange.end)
  ) {
    if (
      paramState.dateTimeFilterRange.start &&
      paramState.dateTimeFilterRange.end
    ) {
      const f = cqlDefaultFilters.get("BETWEEN_TIME_RANGE") as TemporalDuring;
      result.filter = appendFilter(
        result.filter,
        f(
          paramState.dateTimeFilterRange.start,
          paramState.dateTimeFilterRange.end
        )
      );
    } else if (
      paramState.dateTimeFilterRange.start === undefined &&
      paramState.dateTimeFilterRange.end
    ) {
      const f = cqlDefaultFilters.get("BEFORE_TIME") as TemporalAfterOrBefore;
      result.filter = appendFilter(
        result.filter,
        f(paramState.dateTimeFilterRange.end)
      );
    } else if (
      paramState.dateTimeFilterRange.end === undefined &&
      paramState.dateTimeFilterRange.start
    ) {
      const f = cqlDefaultFilters.get("AFTER_TIME") as TemporalAfterOrBefore;
      result.filter = appendFilter(
        result.filter,
        f(paramState.dateTimeFilterRange.start)
      );
    }
  }

  if (paramState.bbox) {
    const f = cqlDefaultFilters.get(
      paramState.includeNoGeometry
        ? "BBOX_POLYGON_OR_EMPTY_EXTENTS"
        : "BBOX_POLYGON"
    ) as PolygonOperation;
    result.filter = appendFilter(result.filter, f(paramState.bbox));
  }

  let spatialFilter: string | undefined;

  if (paramState.staticAreas && paramState.staticAreas.length > 0) {
    const f = cqlDefaultFilters.get("STATIC_AREAS") as StaticAreasFilter;
    spatialFilter = f(paramState.staticAreas);
  }

  if (paramState.polygon) {
    const f = cqlDefaultFilters.get("INTERSECT_POLYGON") as PolygonOperation;
    const polygonFilter = f(paramState.polygon);
    spatialFilter = spatialFilter
      ? `(${spatialFilter} OR ${polygonFilter})`
      : polygonFilter;
  }

  if (spatialFilter) {
    result.filter = appendFilter(result.filter, spatialFilter);
  }

  if (paramState.parameterVocabs && paramState.parameterVocabs.length > 0) {
    const f = cqlDefaultFilters.get("PARAMETER_VOCABS_IN") as ParameterVocabsIn;
    const parameterVocabFilter = f(paramState.parameterVocabs);
    if (parameterVocabFilter) {
      result.filter = appendFilter(result.filter, parameterVocabFilter);
    }
  }

  if (paramState.platform && paramState.platform.length > 0) {
    const f = cqlDefaultFilters.get(
      "UPDATE_PLATFORM_FILTER_VARIABLES"
    ) as PlatformFilter;
    result.filter = appendFilter(result.filter, f(paramState.platform));
  }

  return result;
};

export { createSuggesterParamFrom, createSearchParamFrom };

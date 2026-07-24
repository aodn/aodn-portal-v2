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
  i: ParameterState,
  control?: SearchControl
): SearchParameters => {
  const p: SearchParameters = {};
  p.sortby = i.sortby;
  p.text = i.searchText;

  const c = mergeWithDefaults<SearchControl>(
    {
      score: DEFAULT_SEARCH_SCORE,
    },
    control
  );

  // The score control how relevant the records
  // ! DO NO USE SCORE !, it will cause no result in some case because
  // some text search only hit the filter which cause score become null
  // if you set score you got nothing.
  // p.filter = `score>=${calculateScore(c.score, p.text)}`;

  // Control how many record return in 1 page.
  if (c.pagesize) {
    p.filter = appendFilter(p.filter, `page_size=${c.pagesize}`);
  }

  if (c.searchafter) {
    p.filter = appendFilter(
      p.filter,
      `search_after='${c.searchafter.join("||")}'`
    );
  }

  if (i.datasetGroup) {
    const f = cqlDefaultFilters.get("DATASET_GROUP") as DatasetGroup;
    p.filter = appendFilter(p.filter, f(i.datasetGroup));
  }

  if (i.hasCOData) {
    // Filter records that have cloud optimized data OR have a downloadable link
    const coDataFilter = (cqlDefaultFilters.get("IS_NOT_NULL") as IsNotNull)(
      "assets_summary"
    );
    const downloadLinkFilter = "links_airole_contains='download'";
    p.filter = appendFilter(
      p.filter,
      `(${coDataFilter} OR ${downloadLinkFilter})`
    );
  }

  if (i.excludeDocument) {
    const f = cqlDefaultFilters.get(
      "EXCLUDE_DATASET_SCOPE"
    ) as ExcludeDatasetScope;
    p.filter = appendFilter(p.filter, f("document"));
  }

  if (i.updateFreq) {
    const f = cqlDefaultFilters.get("UPDATE_FREQUENCY") as UpdateFrequency;
    p.filter = appendFilter(p.filter, f(i.updateFreq));
  }

  if (i.datasetStatus) {
    const f = cqlDefaultFilters.get("STATUS") as Status;
    p.filter = appendFilter(p.filter, f(i.datasetStatus));
  }

  if (
    i.dateTimeFilterRange &&
    (i.dateTimeFilterRange.start || i.dateTimeFilterRange.end)
  ) {
    if (i.dateTimeFilterRange.start && i.dateTimeFilterRange.end) {
      const f = cqlDefaultFilters.get("BETWEEN_TIME_RANGE") as TemporalDuring;
      p.filter = appendFilter(
        p.filter,
        f(i.dateTimeFilterRange.start, i.dateTimeFilterRange.end)
      );
    } else if (
      i.dateTimeFilterRange.start === undefined &&
      i.dateTimeFilterRange.end
    ) {
      const f = cqlDefaultFilters.get("BEFORE_TIME") as TemporalAfterOrBefore;
      p.filter = appendFilter(p.filter, f(i.dateTimeFilterRange.end));
    } else if (
      i.dateTimeFilterRange.end === undefined &&
      i.dateTimeFilterRange.start
    ) {
      const f = cqlDefaultFilters.get("AFTER_TIME") as TemporalAfterOrBefore;
      p.filter = appendFilter(p.filter, f(i.dateTimeFilterRange.start));
    }
  }

  if (i.bbox) {
    const f = cqlDefaultFilters.get(
      i.includeNoGeometry ? "BBOX_POLYGON_OR_EMPTY_EXTENTS" : "BBOX_POLYGON"
    ) as PolygonOperation;
    p.filter = appendFilter(p.filter, f(i.bbox));
  }

  let spatialFilter: string | undefined;

  if (i.staticAreas && i.staticAreas.length > 0) {
    const f = cqlDefaultFilters.get("STATIC_AREAS") as StaticAreasFilter;
    spatialFilter = f(i.staticAreas);
  }

  if (i.polygon) {
    const f = cqlDefaultFilters.get("INTERSECT_POLYGON") as PolygonOperation;
    const polygonFilter = f(i.polygon);
    spatialFilter = spatialFilter
      ? `(${spatialFilter} OR ${polygonFilter})`
      : polygonFilter;
  }

  if (spatialFilter) {
    p.filter = appendFilter(p.filter, spatialFilter);
  }

  if (i.parameterVocabs && i.parameterVocabs.length > 0) {
    const f = cqlDefaultFilters.get("PARAMETER_VOCABS_IN") as ParameterVocabsIn;
    const parameterVocabFilter = f(i.parameterVocabs);
    if (parameterVocabFilter) {
      p.filter = appendFilter(p.filter, parameterVocabFilter);
    }
  }

  if (i.platform && i.platform.length > 0) {
    const f = cqlDefaultFilters.get(
      "UPDATE_PLATFORM_FILTER_VARIABLES"
    ) as PlatformFilter;
    p.filter = appendFilter(p.filter, f(i.platform));
  }

  return p;
};

export { createSuggesterParamFrom, createSearchParamFrom };

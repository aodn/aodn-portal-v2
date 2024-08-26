/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
import dayjs from "dayjs";
import { dateDefault } from "./constants";
import { Feature, Polygon, GeoJsonProperties } from "geojson";
import * as wellknown from "wellknown";
import { Category } from "./store/componentParamReducer";
import { DatasetFrequency } from "./store/searchReducer";

// TODO: refactor this, naming like this is not ideal for readability,
//  what are T, J, R, p, i , j, c, d, x, y, z, etc. actually mean?
type SingleArgumentFunction<T, R> = (p: T) => R;
type DualArgumentFunction<I, J, R> = (i: I, j: J) => R;

export type PolygonOperation = SingleArgumentFunction<
  Feature<Polygon, GeoJsonProperties>,
  string
>;
export type TemporalAfterOrBefore = SingleArgumentFunction<number, string>;
export type TemporalDuring = DualArgumentFunction<number, number, string>;
export type CategoriesIn = SingleArgumentFunction<
  Array<Category>,
  string | undefined
>;
export type UpdateFrequency = SingleArgumentFunction<DatasetFrequency, string>;
/**
 * common key is the search text input that belongs to both "suggest_phrases" and "discovery_parameters". e.g. temperature
 * the OGC API needs to query this type of search text input differently;
 * therefore, the constructed URI by the frontend app needs to distinguish type of particular search text input
 **/
export type CommonKey = SingleArgumentFunction<string, string | undefined>;
export type CategoriesWithCommonKey = DualArgumentFunction<
  Array<Category>,
  string,
  string | undefined
>;

export type FilterTypes =
  | string
  | CommonKey
  | CategoriesWithCommonKey
  | CategoriesIn
  | TemporalDuring
  | TemporalAfterOrBefore
  | PolygonOperation
  | UpdateFrequency;

const funcUpdateFrequency: UpdateFrequency = (freq: DatasetFrequency) =>
  `update_frequency='${freq}'`;

const funcTemporalAfter: TemporalAfterOrBefore = (s: number) =>
  `temporal AFTER ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}`;

const funcTemporalBefore: TemporalAfterOrBefore = (s: number) =>
  `temporal BEFORE ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}`;

const funcIntersectPolygon: PolygonOperation = (p) => {
  const geojson = p.geometry as wellknown.GeoJSONGeometry;
  const wkt = wellknown.stringify(geojson);
  return `INTERSECTS(geometry,${wkt})`;
};

const funcCategories: CategoriesIn = (categories: Array<Category>) => {
  const categoryLabels: string[] = [];
  // grab labels only
  categories.forEach((category) => {
    categoryLabels.push(
      `discovery_categories='${category.label?.toLowerCase()}'`
    );
  });
  // if no category, return undefined
  if (categoryLabels.length === 0) {
    return undefined;
  }
  return `(${categoryLabels.join(" or ")})`;
};

const funcCommonTypeSearchText: (searchText: string) => undefined | string = (
  searchText: string
) => {
  const st = searchText?.toLowerCase();
  if (st) {
    const results: string[] = [];
    results.push(`discovery_categories='${st}'`);
    results.push(`fuzzy_content='${st}'`);
    return `(${results.join(" or ")})`;
  } else {
    // if no category, return undefined
    return undefined;
  }
};

const funcCategoriesWithCommonTypeSearchText: CategoriesWithCommonKey = (
  categories: Array<Category>,
  searchText: string
) => {
  const results: string[] = [];
  categories.forEach((category) => {
    results.push(`discovery_categories='${category.label?.toLowerCase()}'`);
  });

  const st = searchText?.toLowerCase();
  if (st) {
    results.push(`discovery_categories='${st}'`);
    results.push(`fuzzy_content='${st}'`);
  }
  // if no category, return undefined
  if (results.length === 0) {
    return undefined;
  }
  return `(${results.join(" or ")})`;
};

/**
 * The CQL filter format for search dataset given start/end date
 * @param s
 * @param e
 */
const funcTemporalBetween: TemporalDuring = (s: number, e: number) =>
  `temporal DURING ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}/${dayjs(e).format(dateDefault["DATE_TIME_FORMAT"])}`;

/**
 * Keep all cql query here, otherwise it will be very hard to manage
 */
const cqlDefaultFilters = new Map<string, FilterTypes>();
cqlDefaultFilters
  .set("CATEGORIES_IN", funcCategories)
  .set("COMMON_KEY", funcCommonTypeSearchText)
  .set("CATEGORIES_WITH_COMMON_KEY", funcCategoriesWithCommonTypeSearchText)
  .set("IMOS_ONLY", "dataset_provider='IMOS'")
  .set("ALL_TIME_RANGE", "temporal after 1970-01-01T00:00:00Z")
  .set("BETWEEN_TIME_RANGE", funcTemporalBetween)
  .set("AFTER_TIME", funcTemporalAfter)
  .set("BEFORE_TIME", funcTemporalBefore)
  .set("INTERSECT_POLYGON", funcIntersectPolygon)
  .set("UPDATE_FREQUENCY", funcUpdateFrequency);

export { cqlDefaultFilters };

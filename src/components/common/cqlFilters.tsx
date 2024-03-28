/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
import dayjs from "dayjs";
import { dateDefault } from "./constants";
import { Feature, Polygon, Properties } from "@turf/turf";
import * as wellknown from "wellknown";
import { Category } from "./store/componentParamReducer";

type SingleArgumentFunction<T, R> = (p: T) => R;
type DualArgumentFunction<I, J, R> = (i: I, j: J) => R;

export type PolygonOperation = SingleArgumentFunction<
  Feature<Polygon, Properties>,
  string
>;
export type TemporalAfterOrBefore = SingleArgumentFunction<number, string>;
export type TemporalDuring = DualArgumentFunction<number, number, string>;
export type CategoriesIn = SingleArgumentFunction<Array<Category>, string>;

export type FilterTypes =
  | string
  | TemporalDuring
  | TemporalAfterOrBefore
  | PolygonOperation;

const funcTemporalAfter: TemporalAfterOrBefore = (s: number) =>
  `temporal AFTER ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}`;

const funcTemporalBefore: TemporalAfterOrBefore = (s: number) =>
  `temporal BEFORE ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}`;

const funcIntersectPolygon: PolygonOperation = (p) => {
  const geojson = p.geometry as wellknown.GeoJSONGeometry;
  const wkt = wellknown.stringify(geojson);
  return `INTERSECTS(geometry,${wkt})`;
};

const funcCategories: CategoriesIn = (s: Array<Category>) => {
  let q = "";
  const or = " OR ";
  s.forEach((i) => (q = q + `category='${i.label}'${or}`));

  // Remove the last OR
  const query = `(${q.substring(0, q.length - or.length)})`;
  return query !== "()" ? query : undefined;
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
  .set("IMOS_ONLY", "dataset_provider='IMOS'")
  .set("ALL_TIME_RANGE", "temporal after 1970-01-01T00:00:00Z")
  .set("BETWEEN_TIME_RANGE", funcTemporalBetween)
  .set("AFTER_TIME", funcTemporalAfter)
  .set("BEFORE_TIME", funcTemporalBefore)
  .set("INTERSECT_POLYGON", funcIntersectPolygon)
  .set("REAL_TIME_ONLY", "update_frequency='real-time'");

export { cqlDefaultFilters };

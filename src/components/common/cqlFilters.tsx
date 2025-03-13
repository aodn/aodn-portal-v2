/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
import dayjs from "dayjs";
import { dateDefault } from "./constants";
import { Feature, Polygon, GeoJsonProperties } from "geojson";
import * as wellknown from "wellknown";
import { Vocab } from "./store/componentParamReducer";
import { DatasetFrequency } from "./store/searchReducer";
import { bbox } from "@turf/turf";

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
export type ParameterVocabsIn = SingleArgumentFunction<
  Array<Vocab>,
  string | undefined
>;
export type UpdateFrequency = SingleArgumentFunction<DatasetFrequency, string>;
export type PlatformFilter = SingleArgumentFunction<Array<string>, string>;
export type IsNotNull = SingleArgumentFunction<string, string>;
export type FilterTypes =
  | string
  | ParameterVocabsIn
  | TemporalDuring
  | TemporalAfterOrBefore
  | PolygonOperation
  | UpdateFrequency
  | PlatformFilter
  | IsNotNull;

const funcIsNotNull: IsNotNull = (field: string) => `(${field} IS NOT NULL)`;

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

const funcBBoxPolygon: PolygonOperation = (p) => {
  const [minx, miny, maxx, maxy] = bbox(p);
  return `BBOX(geometry,${minx},${miny},${maxx},${maxy})`;
};
// Some record do not have spatial extents, this function include those during BBOX search
const funcBBoxPolygonOrEmptyExtents: PolygonOperation = (p) => {
  const [minx, miny, maxx, maxy] = bbox(p);
  return `(BBOX(geometry,${minx},${miny},${maxx},${maxy}) OR geometry IS NULL)`;
};

const funcParameterVocabs: ParameterVocabsIn = (vocabs: Array<Vocab>) => {
  const parameterVocabLabels: string[] = [];
  // grab labels only
  vocabs.forEach((vocab) => {
    parameterVocabLabels.push(
      `parameter_vocabs='${vocab.label?.toLowerCase()}'`
    );
  });
  // if no parameter vocabs, return undefined
  if (parameterVocabLabels.length === 0) {
    return undefined;
  }
  return `(${parameterVocabLabels.join(" or ")})`;
};

const funcPlatformFilter: PlatformFilter = (platforms: Array<string>) => {
  if (!platforms || platforms.length === 0) return "";

  const platformQueries = platforms.map(
    (platform) => `platform_vocabs='${platform}'`
  );
  return `(${platformQueries.join(" or ")})`;
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
  .set("PARAMETER_VOCABS_IN", funcParameterVocabs)
  .set("IMOS_ONLY", "dataset_provider='IMOS'")
  .set("ALL_TIME_RANGE", "temporal after 1970-01-01T00:00:00Z")
  .set("BETWEEN_TIME_RANGE", funcTemporalBetween)
  .set("AFTER_TIME", funcTemporalAfter)
  .set("BEFORE_TIME", funcTemporalBefore)
  .set("INTERSECT_POLYGON", funcIntersectPolygon)
  .set("BBOX_POLYGON", funcBBoxPolygon)
  .set("BBOX_POLYGON_OR_EMPTY_EXTENTS", funcBBoxPolygonOrEmptyExtents)
  .set("UPDATE_FREQUENCY", funcUpdateFrequency)
  .set("UPDATE_PLATFORM_FILTER_VARIABLES", funcPlatformFilter)
  .set("IS_NOT_NULL", funcIsNotNull);

export { cqlDefaultFilters };

/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
import dayjs from "dayjs";
import { dateDefault } from "./constants";
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import * as wellknown from "wellknown";
import {
  DatasetFrequency,
  DatasetStatus,
  SelectedStaticArea,
  Vocab,
} from "@/app/store/searchParamsReducer";
import { bbox } from "@turf/turf";

// TODO: refactor this, naming like this is not ideal for readability,
//  what are T, J, R, p, i , j, c, d, x, y, z, etc. actually mean?
type SingleArgumentFunction<T, R> = (p: T) => R;
type DualArgumentFunction<I, J, R> = (i: I, j: J) => R;

export type PolygonOperation = SingleArgumentFunction<
  Feature<Polygon | MultiPolygon, GeoJsonProperties>,
  string
>;
export type TemporalAfterOrBefore = SingleArgumentFunction<number, string>;
export type TemporalDuring = DualArgumentFunction<number, number, string>;
export type ParameterVocabsIn = SingleArgumentFunction<
  Array<Vocab>,
  string | undefined
>;
export type UpdateFrequency = SingleArgumentFunction<DatasetFrequency, string>;
export type DatasetGroup = SingleArgumentFunction<string, string>;
export type PlatformFilter = SingleArgumentFunction<Array<string>, string>;
export type Status = SingleArgumentFunction<DatasetStatus, string>;
export type ExcludeDatasetScope = SingleArgumentFunction<string, string>;
export type StaticAreasFilter = SingleArgumentFunction<
  Array<SelectedStaticArea>,
  string
>;
export type IsNotNull = SingleArgumentFunction<string, string>;

const funcIsNotNull: IsNotNull = (field: string) => `(${field} IS NOT NULL)`;

const funcUpdateFrequency: UpdateFrequency = (freq: DatasetFrequency) => {
  // For other option, return other mode only
  if (freq === DatasetFrequency.OTHER) {
    return `ai_update_frequency='${freq}'`;
  }
  // For real-time or delayed, also include records marked as 'both'
  return `(ai_update_frequency='${freq}' OR ai_update_frequency='${DatasetFrequency.BOTH}')`;
};

const funcStatus: Status = (stat: DatasetStatus) => `status='${stat}'`;

const funcExcludeDatasetScope: ExcludeDatasetScope = (scope: string) =>
  `NOT (scope='${scope}')`;

const funcUpdateDatasetGroup: DatasetGroup = (name: string) =>
  `dataset_group='${name}'`;

const funcTemporalAfter: TemporalAfterOrBefore = (s: number) =>
  `temporal AFTER ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}`;

const funcTemporalBefore: TemporalAfterOrBefore = (s: number) =>
  `temporal BEFORE ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}`;

const funcIntersectPolygon: PolygonOperation = (
  p: Feature<Polygon | MultiPolygon, GeoJsonProperties>
) => {
  const geojson = p.geometry as wellknown.GeoJSONGeometry;
  const wkt = wellknown.stringify(geojson);
  return `INTERSECTS(geometry,${wkt})`;
};

const funcStaticAreas: StaticAreasFilter = (
  areas: Array<SelectedStaticArea>
) => {
  if (!areas || areas.length === 0) return "";

  const queries = areas.map(
    (area) =>
      `INTERSECTS(geometry,IBOUNDARY('${area.boundaryName}','${area.value}'))`
  );
  return `(${queries.join(" OR ")})`;
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
  const parameterVocabQueries = vocabs.map((vocab) => {
    const label = vocab.label?.toLowerCase();
    return `(parameter_vocabs='${label}' OR ai_parameter_vocabs='${label}')`;
  });

  // if no parameter vocabs, return undefined
  if (parameterVocabQueries.length === 0) {
    return undefined;
  }
  return `(${parameterVocabQueries.join(" OR ")})`;
};

const funcPlatformFilter: PlatformFilter = (platforms: Array<string>) => {
  if (!platforms || platforms.length === 0) return "";

  const platformQueries = platforms.map(
    (platform) =>
      `(platform_vocabs='${platform}' OR ai_platform_vocabs='${platform}')`
  );
  return `(${platformQueries.join(" OR ")})`;
};

/**
 * The CQL filter format for search dataset given start/end date
 * @param s
 * @param e
 */
const funcTemporalBetween: TemporalDuring = (s: number, e: number) =>
  `temporal DURING ${dayjs(s).format(dateDefault["DATE_TIME_FORMAT"])}/${dayjs(e).format(dateDefault["DATE_TIME_FORMAT"])}`;

/**
 * All cql filters in one typed object — call them directly, e.g.
 * cqlFilters.updateFrequency(freq). Typos fail at compile time and no
 * casts are needed at the call sites.
 */
const cqlFilters = {
  parameterVocabsIn: funcParameterVocabs,
  datasetGroup: funcUpdateDatasetGroup,
  allTimeRange: "temporal after 1970-01-01T00:00:00Z",
  betweenTimeRange: funcTemporalBetween,
  afterTime: funcTemporalAfter,
  beforeTime: funcTemporalBefore,
  intersectPolygon: funcIntersectPolygon,
  bboxPolygon: funcBBoxPolygon,
  bboxPolygonOrEmptyExtents: funcBBoxPolygonOrEmptyExtents,
  updateFrequency: funcUpdateFrequency,
  status: funcStatus,
  excludeDatasetScope: funcExcludeDatasetScope,
  platformFilter: funcPlatformFilter,
  staticAreas: funcStaticAreas,
  isNotNull: funcIsNotNull,
} as const;

export { cqlFilters };

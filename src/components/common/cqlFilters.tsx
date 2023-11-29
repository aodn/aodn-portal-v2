/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
import dayjs from "dayjs";
import {dateDefault} from "./constants";
import {Feature, Polygon, Properties} from "@turf/turf";
import * as wellknown from 'wellknown';

type SingleArgumentFunction<T, R> = (p: T) => R;
type DualArgumentFunction<I, J, R> = (i: I, j: J) => R;

export type PolygonOperation = SingleArgumentFunction<Feature<Polygon, Properties>, string>;
export type TemporalAfterOrBefore = SingleArgumentFunction<number, string>;
export type TemporalDuring = DualArgumentFunction<number,number,string>;

export type FilterTypes = string | TemporalDuring | TemporalAfterOrBefore | PolygonOperation;

const funcTemporalAfter : TemporalAfterOrBefore = (s:number) =>
    `temporal AFTER ${dayjs(s).format(dateDefault['DATE_TIME_FORMAT'])}`;

const funcTemporalBefore : TemporalAfterOrBefore = (s:number) =>
    `temporal BEFORE ${dayjs(s).format(dateDefault['DATE_TIME_FORMAT'])}`;

const funcIntersectPolygon : PolygonOperation = (p)=> {
    const geojson = p.geometry as any;
    const wkt = wellknown.stringify(geojson);
    return `INTERSECTS(geometry,${wkt})`;
}

/**
 * The CQL filter format for search dataset given start/end date
 * @param s
 * @param e
 */
const funcTemporalBetween : TemporalDuring = (s: number, e: number) =>
    `temporal DURING ${dayjs(s).format(dateDefault['DATE_TIME_FORMAT'])}/${dayjs(e).format(dateDefault['DATE_TIME_FORMAT'])}`;


const cqlDefaultFilters = new Map<string, FilterTypes>();
cqlDefaultFilters
    .set('IMOS_ONLY', 'dataset_provider=\'IMOS\'')
    .set('ALL_TIME_RANGE','temporal after 1970-01-01T00:00:00Z')
    .set('BETWEEN_TIME_RANGE', funcTemporalBetween)
    .set("AFTER_TIME", funcTemporalAfter)
    .set("BEFORE_TIME", funcTemporalBefore)
    .set("INTERSECT_POLYGON", funcIntersectPolygon)
    .set("REAL_TIME_ONLY", 'update_frequency=\'real-time\'');

export {
    cqlDefaultFilters
}
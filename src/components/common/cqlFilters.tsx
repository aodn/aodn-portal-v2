/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
import dayjs from "dayjs";

export type TemporalBetween = (s: Date, e: Date) => string;
export type FilterTypes = string | TemporalBetween;

// Must use this format to do search, we do not care about the time
const DATE_TIME_FORMAT = 'YYYY-MM-DDT00:00:00[Z]';
/**
 * The CQL filter format for search dataset given start/end date
 * @param s
 * @param e
 */
const funcTemporalBetween : TemporalBetween = (s: Date, e: Date) => {
    return `temporal DURING ${dayjs(s).format(DATE_TIME_FORMAT)}/${dayjs(e).format(DATE_TIME_FORMAT)}`;
}

const cqlDefaultFilters = new Map<string, FilterTypes>();
cqlDefaultFilters
    .set('IMOS_ONLY', 'providers like \'%IMOS%\'')
    .set('ALL_TIME_RANGE','temporal after 1970-01-01T00:00:00Z')
    .set('BETWEEN_TIME_RANGE', funcTemporalBetween);

export {
    cqlDefaultFilters
}
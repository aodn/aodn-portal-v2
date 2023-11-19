import {OGCCollections} from "../store/searchReducer";

export interface FilterGroup {
    name: string
    filters: Array<Filter>
}

export interface Filter {
    name: string
}

const getAllFilters = () : Array<FilterGroup> => {
    return [
        {
            name: 'Parameter',
            filters: [
                {
                    name: 'Biological'
                },
                {
                    name: 'Chemical'
                },
                {
                    name: 'Physical Atmosphere'
                },
                {
                    name: 'Physcial Water'
                },
            ]
        },
        {
            name: 'Topic',
            filters: [
                {
                    name: 'Ocean'
                },
                {
                    name: 'Biota'
                },
                {
                    name: 'Environment'
                },
                {
                    name: 'Climatology'
                },
                {
                    name: 'Tourism'
                },
                {
                    name: 'Something else'
                },
            ]
        },
        {
            name: 'Platform',
            filters: [
                {
                    name: 'Biological Platform'
                },
                {
                    name: 'Mooring and Buoy'
                },
                {
                    name: 'Radar'
                },
                {
                    name: 'Vessel'
                },
                {
                    name: 'Some other platform'
                },
            ]
        }
    ];
}

/**
 * Find the smallest day among the stacs record
 * TODO: Need auto test
 * @param stacs
 */
const findSmallestDate = (stacs : OGCCollections) : Date | null | undefined => {
    return stacs.collections
        .map<Date | null | undefined>(value =>
            // flatten the start date in the array and then get the smallest
            // start date within the same stac
            value
                ?.extent
                ?.temporal
                ?.interval
                ?.flatMap<Date | null>(m => m[0] ? new Date(m[0]) : null)
                .reduce((a,b) => a !== null && b !== null && a < b ? a : b)
        )
        // Remove all null and undefined
        .filter(f => f !== null && f !== undefined)
        // find the smallest among all the stacs
        .reduce((a, b) => a && b && a < b ? a : b);
}

export {
    findSmallestDate,
    getAllFilters,
}
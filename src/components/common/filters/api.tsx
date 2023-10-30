
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

export {
    getAllFilters,
}
"""Constants for search filter parameters used in API URL validation."""


class SearchFilterParams:
    """URL parameter names for search filters."""

    DATE_RANGE = 'temporal_during'
    INTERSECTS = 'INTERSECTS'
    PARAMETER_VOCABS = 'parameter_vocabs'
    PLATFORM_VOCABS = 'platform_vocabs'
    DATASET_PROVIDER = 'dataset_provider'
    UPDATE_FREQUENCY = 'update_frequency'
    ASSETS_SUMMARY = 'assets_summary'


class SearchFilterValues:
    """Expected values for search filters."""

    DATE_RANGE = 'temporal during'
    ASSETS_SUMMARY_NOT_NULL = 'assets_summary is not null'

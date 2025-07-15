from core.constants.search_filters import SearchFilterParams, SearchFilterValues
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class AssetsSummaryValidator(BaseValidator):
    """
    Validates whether the URL filter correctly reflects the `download_service_available` flag
    from the search filter configuration.

    If `download_service_available` is True, the filter string must include the expression
    'assets_summary IS NOT NULL'.
    If False, the expression must not be present.
    """

    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.ASSETS_SUMMARY
        expression = SearchFilterValues.ASSETS_SUMMARY_NOT_NULL
        if self.config.download_service_available is True:
            return key, self.contains_expression(expression)
        else:
            return key, not self.contains_expression(expression)

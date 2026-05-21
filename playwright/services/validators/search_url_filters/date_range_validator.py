import re

from core.constants.search_filters import SearchFilterParams, SearchFilterValues
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class DateRangeValidator(BaseValidator):
    """
    Validates that the URL filter correctly includes the expected temporal date range
    based on the search filter configuration.

    If temporal_during is provided, checks that the URL contains the expected temporal_during value.
    Otherwise, confirms that the URL does not include any date range filter expression.
    """

    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.DATE_RANGE
        if self.config.temporal_during:
            expected_value = self.config.temporal_during.lower()
        else:
            expression = SearchFilterValues.DATE_RANGE
            return key, not self.contains_expression(expression)

        actual_value = self.get_date_range_from_url()

        return key, actual_value == expected_value

    def get_date_range_from_url(self) -> str:
        """
        Extract the actual date range from the URL filter string.

        Looks for a 'temporal during' expression and parses its start and end dates.

        Returns:
            str: The extracted date range value.

        """
        filter = self._extract_filter_param()
        pattern = r'temporal during ([^/]+)/([^\s]+)'
        match = re.search(pattern, filter)
        if match:
            return f'temporal during {match.group(1)}/{match.group(2)}'
        else:
            raise ValueError(f'Date range not found in URL: {self.url}')

import re

from core.constants.search_filters import SearchFilterParams, SearchFilterValues
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class DateRangeValidator(BaseValidator):
    """
    Validates that the URL filter correctly includes the expected temporal date range
    based on the search filter configuration.

    If both `date_time_start` and `date_time_end` are provided, ensures that the URL
    contains a 'temporal during' expression matching the formatted date range.
    Otherwise, confirms that the URL does not include any date range filter expression.
    """

    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.DATE_RANGE
        if self.config.date_time_start and self.config.date_time_end:
            expected_value = self.get_formatted_date_range(
                self.config.date_time_start, self.config.date_time_end
            )
        else:
            expression = SearchFilterValues.DATE_RANGE
            return key, not self.contains_expression(expression)

        actual_value = self.get_date_range_from_url()

        return key, actual_value == expected_value

    def get_formatted_date_range(
        self, start_date: str, end_date: str
    ) -> tuple[str, str]:
        """
        Format start and end dates into the expected API filter format.

        Each date is reformatted to 'YYYY-MM-DDT00:00:00Z'.

        Args:
            start_date (str): The start date in 'DD/MM/YYYY' format.
            end_date (str): The end date in 'DD/MM/YYYY' format.

        Returns:
            tuple[str, str]: The formatted start and end date strings.
        """
        start_date = f'{self.reformat_date(start_date)}t00:00:00z'
        end_date = f'{self.reformat_date(end_date)}t00:00:00z'
        return start_date, end_date

    def get_date_range_from_url(self) -> tuple[str, str]:
        """
        Extract the actual date range from the URL filter string.

        Looks for a 'temporal during' expression and parses its start and end dates.

        Returns:
            tuple[str, str]: The extracted start and end dates.

        """
        filter = self._extract_filter_param()
        pattern = r'temporal during ([^/]+)/([^\s]+)'
        match = re.search(pattern, filter)
        if match:
            start_date = match.group(1)
            end_date = match.group(2)
            return start_date, end_date
        else:
            raise ValueError(f'Date range not found in URL: {self.url}')

    def reformat_date(self, date_str: str) -> str:
        """
        Reformat a date string from 'DD/MM/YYYY' format to 'YYYY-MM-DD' format.

        Parameters:
            date_str (str): A string representing a date in 'DD/MM/YYYY' format.

        Returns:
            str: A string representing the date in 'YYYY-MM-DD' format.
        """
        day, month, year = date_str.split('/')
        return f'{year}-{month}-{day}'

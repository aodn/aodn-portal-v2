import re
from abc import ABC, abstractmethod
from urllib.parse import parse_qs, unquote, urlparse

from core.dataclasses.search_filter import SearchFilterConfig


class BaseValidator(ABC):
    def __init__(self, url: str, config: SearchFilterConfig):
        """
        Initialize the validator with the target URL and expected filter configuration.

        Args:
            url (str): The API request URL to validate.
            config (SearchFilterConfig): The expected filter parameters.
        """
        self.url = url.lower()
        self.config = config
        self.filter_str = self._extract_filter_param()

    @abstractmethod
    def validate(self) -> tuple[str, bool]:
        """
        Perform validation for a specific filter key.

        Returns:
            tuple[str, bool]: A tuple containing the filter key and validation result.
        """
        pass

    def _extract_filter_param(self) -> str:
        """
        Extract and decode the 'filter' query parameter from the URL.

        Returns:
            str: The decoded filter string.
        """
        parsed = urlparse(self.url)
        query_params = parse_qs(parsed.query)
        raw_filter = query_params.get('filter', [''])[0]
        return unquote(raw_filter)

    def validate_param_value(
        self, key: str, expected_value: str | None
    ) -> bool:
        """
        Validate whether a given filter key has the expected value in the URL filter string.

        Args:
            key (str): The filter parameter key.
            expected_value (str | None): The expected value, or None if it should not appear.

        Returns:
            bool: True if the key and expected value match; False otherwise.
        """
        if expected_value is not None:
            pattern = rf"{re.escape(key)}=['\"]?{re.escape(expected_value.lower())}['\"]?"
            return re.search(pattern, self.filter_str) is not None
        else:
            return not self.contains_expression(key)

    def contains_expression(self, expression: str) -> bool:
        """
        Check if the filter string contains a specific expression (case-insensitive).

        Args:
            expression (str): The expression to search for.

        Returns:
            bool: True if found; False otherwise.
        """
        return expression.lower() in self.filter_str

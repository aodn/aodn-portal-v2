import re

from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import BaseValidator
from utils.json_utils import load_json_data


class IntersectsValidator(BaseValidator):
    """
    Validates that the URL filter correctly includes the expected spatial INTERSECTS expression
    based on the configured location name.

    If `location_name` is provided, checks that the URL contains the corresponding
    intersects value loaded from a JSON mapping. Otherwise, ensures that
    the INTERSECTS expression is not present in the URL.
    """

    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.INTERSECTS
        if self.config.location_name:
            expected_value = self.get_intersects_value_from_mapping(
                self.config.location_name
            )
        else:
            expression = SearchFilterParams.INTERSECTS
            return key, not self.contains_expression(expression)

        actual_value = self.get_intersects_value_from_url()

        return key, actual_value == expected_value

    def get_intersects_value_from_mapping(self, name: str) -> str | None:
        """
        Look up the intersects value for the given location name from a JSON mapping file.

        Args:
            name (str): The location name configured in the search filter.

        Returns:
            str | None: The expected intersects value in lowercase, or None if not found.
        """
        mapping = load_json_data(
            'Australian_Marine_Parks_name_boundaries_mapping.json'
        )
        for item in mapping:
            if item['key'] == name:
                return item['Value'].lower()
        return None

    def get_intersects_value_from_url(self) -> str | None:
        """
        Extract the actual intersects expression from the URL.

        Returns:
            str | None: The extracted intersects expression.
        """
        intersects_match = re.search(r'intersects\((.*?)\)\)\)', self.url)
        if intersects_match:
            return f'intersects({intersects_match.group(1)})))'
        else:
            raise ValueError(
                f'INTERSECTS expression not found in URL: {self.url}'
            )

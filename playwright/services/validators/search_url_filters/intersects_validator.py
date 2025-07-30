import re

from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import BaseValidator


class IntersectsValidator(BaseValidator):
    """
    Validates that the URL filter correctly includes the expected spatial INTERSECTS expression.

    If location_intersects is provided, checks that the URL contains the expected intersects value.
    Otherwise, ensures that the INTERSECTS expression is not present in the URL.
    """

    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.INTERSECTS
        if self.config.location_intersects:
            expected_value = self.config.location_intersects.lower()
        else:
            expression = SearchFilterParams.INTERSECTS
            return key, not self.contains_expression(expression)

        actual_value = self.get_intersects_value_from_url()

        return key, actual_value == expected_value

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

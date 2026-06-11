from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class UpdateFrequencyValidator(BaseValidator):
    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.UPDATE_FREQUENCY
        expected_value = self.config.update_frequency

        if expected_value is None:
            return key, not self.contains_expression(key)

        has_expected = self.validate_param_value(key, expected_value)

        if expected_value == 'other':
            return key, has_expected

        has_both = self.validate_param_value(key, 'both')
        return key, has_expected and has_both

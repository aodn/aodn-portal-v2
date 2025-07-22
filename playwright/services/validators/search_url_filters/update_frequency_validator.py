from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class UpdateFrequencyValidator(BaseValidator):
    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.UPDATE_FREQUENCY
        expected_value = self.config.update_frequency
        is_valid = self.validate_param_value(key, expected_value)
        return key, is_valid

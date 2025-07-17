from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class DatasetProviderValidator(BaseValidator):
    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.DATASET_PROVIDER
        expected_value = self.config.dataset_provider
        is_valid = self.validate_param_value(key, expected_value)
        return key, is_valid

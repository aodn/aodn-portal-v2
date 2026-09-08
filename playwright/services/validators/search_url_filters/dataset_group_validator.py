from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)

IMOS_DATASET_GROUP = 'imos'


class DatasetGroupValidator(BaseValidator):
    """
    IMOS uses an exact dataset_group match. Other organisations use IN so
    records whose group contains that organisation are included.
    """

    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.DATASET_GROUP
        expected_value = self.config.dataset_organisation
        if expected_value is None:
            return key, not self.contains_expression(key)

        organisation = expected_value.lower()
        if organisation == IMOS_DATASET_GROUP:
            is_valid = self.validate_param_value(key, organisation)
        else:
            is_valid = self.contains_expression(f"{key} in('{organisation}')")
        return key, is_valid

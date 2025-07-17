from core.constants.search_filters import SearchFilterParams
from services.validators.search_url_filters.base_validator import (
    BaseValidator,
)


class ParameterVocabsValidator(BaseValidator):
    def validate(self) -> tuple[str, bool]:
        key = SearchFilterParams.PARAMETER_VOCABS
        expected_value = self.config.parameter_vocab_labels
        if expected_value is None:
            return key, not self.contains_expression(key)
        else:
            is_valid = True
            for parameter in self.config.parameter_vocab_labels or []:
                if self.validate_param_value(key, parameter) is False:
                    is_valid = False
                    break
            return key, is_valid

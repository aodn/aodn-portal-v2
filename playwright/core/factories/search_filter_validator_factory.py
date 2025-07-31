from typing import List

from core.dataclasses.search_filter import SearchFilterConfig
from services.validators.search_url_filters.assets_summary_validator import (
    AssetsSummaryValidator,
)
from services.validators.search_url_filters.base_validator import BaseValidator
from services.validators.search_url_filters.dataset_group_validator import (
    DatasetGroupValidator,
)
from services.validators.search_url_filters.date_range_validator import (
    DateRangeValidator,
)
from services.validators.search_url_filters.intersects_validator import (
    IntersectsValidator,
)
from services.validators.search_url_filters.parameter_vocabs_validator import (
    ParameterVocabsValidator,
)
from services.validators.search_url_filters.platform_vocabs_validator import (
    PlatformVocabsValidator,
)
from services.validators.search_url_filters.update_frequency_validator import (
    UpdateFrequencyValidator,
)


class SearchFilterValidatorFactory:
    @staticmethod
    def get_validators(
        url: str, config: SearchFilterConfig
    ) -> List[BaseValidator]:
        validators: List[BaseValidator] = []
        validators.append(DatasetGroupValidator(url, config))
        validators.append(AssetsSummaryValidator(url, config))
        validators.append(UpdateFrequencyValidator(url, config))
        validators.append(DateRangeValidator(url, config))
        validators.append(IntersectsValidator(url, config))
        validators.append(ParameterVocabsValidator(url, config))
        validators.append(PlatformVocabsValidator(url, config))
        return validators

    @staticmethod
    def validate(url: str, expected_filters: SearchFilterConfig) -> dict:
        results = {}
        for validator in SearchFilterValidatorFactory.get_validators(
            url, expected_filters
        ):
            key, result = validator.validate()
            results[key] = result
        return results

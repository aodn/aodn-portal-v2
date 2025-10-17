from http import HTTPStatus
from typing import Dict, List, Union

from playwright.sync_api import Route

from utils.json_utils import load_json_data
from utils.url_utils import get_query_params


class SuggesterOptions:
    def __init__(
        self,
        suggested_organisation_vocabs: List[str],
        suggested_phrases: List[str],
    ):
        self.suggested_organisation_vocabs = suggested_organisation_vocabs
        self.suggested_phrases = suggested_phrases

    def filter_items(self, items: List[str], keyword: str) -> List[str]:
        keyword_lower = keyword.lower()
        return [item for item in items if keyword_lower in item.lower()]

    def get_suggestions(
        self, input: str
    ) -> Dict[str, Union[List[str], Dict[str, List[str]]]]:
        organisation_vocabs = self.filter_items(
            self.suggested_organisation_vocabs, input
        )
        phrases = self.filter_items(self.suggested_phrases, input)
        return {
            'suggested_organisation_vocabs': organisation_vocabs,
            'suggested_phrases': phrases,
        }


def load_suggester_options(filename: str) -> SuggesterOptions:
    data = load_json_data(filename)
    return SuggesterOptions(
        suggested_organisation_vocabs=data['suggested_organisation_vocabs'],
        suggested_phrases=data['suggested_phrases'],
    )


def handle_search_autocomplete_api(route: Route) -> None:
    suggester_options = load_suggester_options('suggester_options.json')

    inputs = get_query_params(route, 'input')
    if len(inputs) != 1:
        route.fulfill(
            status=HTTPStatus.BAD_REQUEST,
            json={'error': f'Found {len(inputs)} input(s), but expected 1'},
        )
    else:
        input_value = inputs[0]
        suggestions = suggester_options.get_suggestions(input_value)

        route.fulfill(json=suggestions)

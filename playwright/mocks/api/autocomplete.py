from http import HTTPStatus
from typing import Dict, List, Union
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import Route

from utils.json_utils import load_json_data


class SuggesterOptions:
    def __init__(
        self, category_suggestions: List[str], suggest_phrases: List[str]
    ):
        self.category_suggestions = category_suggestions
        self.suggest_phrases = suggest_phrases

    def filter_items(self, items: List[str], keyword: str) -> List[str]:
        keyword_lower = keyword.lower()
        return [item for item in items if keyword_lower in item.lower()]

    def get_suggestions(
        self, input: str
    ) -> Dict[str, Union[List[str], Dict[str, List[str]]]]:
        phrases = self.filter_items(self.suggest_phrases, input)
        return {
            'category_suggestions': [input],
            'record_suggestions': {'suggest_phrases': phrases},
        }


def load_suggester_options(filename: str) -> SuggesterOptions:
    data = load_json_data(filename)
    return SuggesterOptions(
        category_suggestions=data['category_suggestions'],
        suggest_phrases=data['record_suggestions']['suggest_phrases'],
    )


def handle_search_autocomplete_api(route: Route) -> None:
    suggester_options = load_suggester_options('suggester_options.json')

    query_string = urlparse(route.request.url).query
    search_params = parse_qs(query_string)

    inputs = search_params.get('input', [])
    if len(inputs) != 1:
        route.fulfill(
            status=HTTPStatus.BAD_REQUEST,
            json={'error': f'Found {len(inputs)} input(s), but expected 1'},
        )
    else:
        input_value = inputs[0]
        suggestions = suggester_options.get_suggestions(input_value)

        route.fulfill(json=suggestions)

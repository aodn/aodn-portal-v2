import json
from http import HTTPStatus
from typing import Dict, List, Union
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import Route


class SuggesterOptions:
    def __init__(
        self, category_suggestions: List[str], record_titles: List[str]
    ):
        self.category_suggestions = category_suggestions
        self.record_titles = record_titles

    def filter_items(self, items: List[str], keyword: str) -> List[str]:
        keyword_lower = keyword.lower()
        return [item for item in items if keyword_lower in item.lower()]

    def get_suggestions(
        self, input: str
    ) -> Dict[str, Union[List[str], Dict[str, List[str]]]]:
        categories = self.filter_items(self.category_suggestions, input)
        titles = self.filter_items(self.record_titles, input)
        return {
            'category_suggestions': categories,
            'record_suggestions': {'titles': titles},
        }


def load_suggester_options(filename: str) -> SuggesterOptions:
    with open(f'mocks/mock_data/{filename}', 'r') as file:
        data = json.load(file)
    return SuggesterOptions(
        category_suggestions=data['category_suggestions'],
        record_titles=data['record_suggestions']['titles'],
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
        # filters_value = search_params.get('filter')
        suggestions = suggester_options.get_suggestions(input_value)

        route.fulfill(json=suggestions)

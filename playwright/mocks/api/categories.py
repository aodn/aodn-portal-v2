import json

from playwright.sync_api import Route


def handle_categories_api(route: Route) -> None:
    with open('mocks/mock_data/categories.json') as f:
        json_data = json.load(f)
    route.fulfill(json=json_data)

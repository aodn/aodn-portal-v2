from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_temporal_api(route: Route) -> None:
    json_data = load_json_data('collections_temporal.json')
    route.fulfill(json=json_data)


def handle_provider_api(route: Route) -> None:
    json_data = load_json_data('collections_providers.json')
    route.fulfill(json=json_data)

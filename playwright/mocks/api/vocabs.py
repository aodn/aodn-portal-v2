from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_vocabs_api(route: Route) -> None:
    json_data = load_json_data('vocabs.json')
    route.fulfill(json=json_data)

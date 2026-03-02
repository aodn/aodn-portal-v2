from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_wfs_layers_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'wfs_layers/{data_id}.json')
        route.fulfill(json=json_data)
    except FileNotFoundError:
        route.fulfill(json={})  # Response not needed in the UI tests


def handle_wfs_field_value_api(route: Route) -> None:
    route.fulfill(json={})  # Response not needed in the UI tests

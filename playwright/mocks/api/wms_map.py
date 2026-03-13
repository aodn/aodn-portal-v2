from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_wms_map_tile_api(route: Route) -> None:
    route.fulfill(json={})  # Response not needed in the UI tests


def handle_wms_layers_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'wms_layers/{data_id}.json')
        route.fulfill(json=json_data)
    except FileNotFoundError:
        route.fulfill(json={})  # Response not needed in the UI tests


def handle_wms_fields_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'wms_fields/{data_id}.json')
        route.fulfill(json=json_data)
    except FileNotFoundError:
        route.fulfill(json=[])  # Response not needed in the UI tests


def handle_wms_map_feature_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'wms_map_feature/{data_id}.json')
        route.fulfill(json=json_data)
    except FileNotFoundError:
        route.fulfill(json=[])  # Response not needed in the UI tests

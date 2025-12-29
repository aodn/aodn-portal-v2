from playwright.sync_api import Route
from utils.json_utils import load_json_data


def handle_wms_map_tile_api(route: Route) -> None:
    route.fulfill(json={})  # Response not needed in the UI tests

def handle_wms_map_layers_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'wms_layers/{data_id}.json')
        route.fulfill(json=json_data)  # Response not needed in the UI tests
    except FileNotFoundError:
        route.fulfill(json={})

# Hardcode a response with type dateTime field so that the time slider button shown.
# We may need to change it later to allow check on hidden time slider button
def handle_wms_downloadable_fields_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'wms_download_fields/{data_id}.json')
        route.fulfill(json=json_data)
    except FileNotFoundError:
        route.fulfill(json={})

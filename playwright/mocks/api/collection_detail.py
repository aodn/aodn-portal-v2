from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_detail_api(route: Route) -> None:
    data_id = route.request.url.split('/')[-1]
    json_data = load_json_data(f'dataset_detail/{data_id}.json')
    route.fulfill(json=json_data)


def handle_detail_summary_api(route: Route) -> None:
    try:
        data_id = route.request.url.split('/')[-3]
        json_data = load_json_data(f'summary/{data_id}.json')
        route.fulfill(json=json_data)
    except FileNotFoundError:
        route.fulfill(json={})  # Response not needed in the UI tests

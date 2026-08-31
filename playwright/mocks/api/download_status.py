from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_download_status_success(route: Route) -> None:
    route.fulfill(
        status=200,
        headers={'Content-Type': 'application/json'},
        json=load_json_data('download_status_successful.json'),
    )

import json

from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_download_dialog_success(route: Route) -> None:
    # Parse the POST body to get the uuid
    request = route.request
    uuid = ''
    if request.post_data:
        post_data = json.loads(request.post_data)
        uuid = post_data['inputs']['uuid']

    if len(uuid) == 0:
        route.fulfill(
            status=400,
            body=json.dumps({'error': 'UUID is required'}),
            headers={'Content-Type': 'application/json'},
        )
    else:
        json_data = load_json_data('download_dialog_success.json')
        route.fulfill(
            status=200,
            headers={'Content-Type': 'application/json'},
            json=json_data,
        )

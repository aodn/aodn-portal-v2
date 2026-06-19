from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_detail_api(route: Route) -> None:
    print(f'[MOCK API] handle_detail_api called for URL: {route.request.url}')
    data_id = route.request.url.split('/')[-1]
    try:
        json_data = load_json_data(f'dataset_detail/{data_id}.json')
        route.fulfill(json=json_data)
    except Exception as e:
        print(f'[MOCK API] handle_detail_api error: {e}')
        raise e


def handle_detail_summary_api(route: Route) -> None:
    data_id = route.request.url.split('/')[-3]
    print(
        f'[MOCK API] handle_detail_summary_api called for URL: {route.request.url}, data_id: {data_id}'
    )
    try:
        json_data = load_json_data(f'summary/{data_id}.json')
        print(
            f"[MOCK API] Successfully loaded summary/{data_id}.json. Features count: {len(json_data.get('features', []))}"
        )
        route.fulfill(json=json_data)
    except FileNotFoundError:
        print(
            f'[MOCK API] File summary/{data_id}.json NOT found. Returning empty dict.'
        )
        route.fulfill(json={})  # Response not needed in the UI tests

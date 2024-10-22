import re
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import Route

from utils.json_utils import filter_collection_by_id, load_json_data


def handle_collections_centroid_api(route: Route) -> None:
    json_data = load_json_data('collections_centroid.json')
    route.fulfill(json=json_data)


def handle_collections_all_api(route: Route) -> None:
    json_data = load_json_data('collections_all.json')
    route.fulfill(json=json_data)


def handle_collections_update_centroid_api(route: Route) -> None:
    json_data = load_json_data('collections_update_centroid.json')
    route.fulfill(json=json_data)


def handle_collections_update_all_api(route: Route) -> None:
    json_data = load_json_data('collections_update_all.json')
    route.fulfill(json=json_data)


def handle_collections_popup_api(route: Route) -> None:
    data = load_json_data('collections_all.json')

    query_string = urlparse(route.request.url).query
    search_params = parse_qs(query_string)
    filters: list = search_params.get('filter', [])
    match = re.search(pattern=r"id='([^']+)'", string=filters[0])
    data_id = ''
    if match:
        data_id = match.group(1)

    collection = filter_collection_by_id(data, data_id)
    route.fulfill(json=collection)


def handle_collections_show_more_api(route: Route) -> None:
    json_data = load_json_data('show_more_results.json')
    route.fulfill(json=json_data)

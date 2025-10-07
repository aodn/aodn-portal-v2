import re

from playwright.sync_api import Route

from utils.json_utils import filter_collection_by_id, load_json_data
from utils.url_utils import get_query_params


def handle_collections_centroid_api(route: Route) -> None:
    query_txt = get_query_params(route, 'q')
    if query_txt and has_dataset_id_in_query(route):
        json_data = load_json_data(f'collections_centroid/{query_txt[0]}.json')
    else:
        json_data = load_json_data('collections_centroid.json')

    route.fulfill(json=json_data)


def handle_collections_all_api(route: Route) -> None:
    query_txt = get_query_params(route, 'q')
    if query_txt and has_dataset_id_in_query(route):
        json_data = load_json_data(f'collections_all/{query_txt[0]}.json')
    else:
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

    filters = get_query_params(route, 'filter')
    match = re.search(pattern=r"id='([^']+)'", string=filters[0])
    data_id = ''
    if match:
        data_id = match.group(1)

    collection = filter_collection_by_id(data, data_id)
    route.fulfill(json=collection)


def handle_collections_show_more_api(route: Route) -> None:
    json_data = load_json_data('show_more_results.json')
    route.fulfill(json=json_data)


def has_dataset_id_in_query(route: Route) -> bool:
    """
    Check whether the request URL contains a valid dataset ID in the 'q' query parameter.

    A valid dataset ID is a 36-character hexadecimal string that may include hyphens.

    Args:
        route (Route): The intercepted Playwright route containing the request URL.

    Returns:
        bool: True if the 'q' parameter exists and contains a valid dataset ID, False otherwise.
    """
    query_txt = get_query_params(route, 'q')
    return bool(query_txt and re.match(r'^[0-9a-fA-F-]{36}$', query_txt[0]))

from urllib.parse import urlparse

from playwright.sync_api import Route

from utils.json_utils import load_json_data

# Cross origin fetch to the S3 bucket, so the fulfilled response needs CORS
# headers or the browser rejects it before the app can read the body
CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

# Served when a collection has no sidecar fixture. Day grouped (`YYYYMMDD`
# periods) over a deliberately wide window so every mocked record's coverage
# falls inside it and the date slider never clamps data away
DEFAULT_METADATA = {
    'min_date': 19900101,
    'max_date': 20291231,
    'time_group_by': 'date',
    'has_time': True,
}


def handle_pmtiles_metadata_api(route: Route) -> None:
    """
    Serve the `{key}.metadata` sidecar for
    `portal/visualization/{collection_id}/{key}.metadata`.

    Its http status is what tells the app whether tiles were ever generated, so
    tests must never depend on reaching the real bucket. Fulfil with a 404 in a
    test to assert the "no tiles" fallback.

    Add `pmtiles_metadata/{collection_id}.json` when a test needs that record's
    real coverage bounds on the date slider; without one it gets
    `DEFAULT_METADATA`.
    """
    path_parts = urlparse(route.request.url).path.split('/')
    data_id = path_parts[-2] if len(path_parts) > 1 else ''
    print(
        f'[MOCK API] handle_pmtiles_metadata_api called for URL: {route.request.url}, data_id: {data_id}'
    )
    try:
        json_data = load_json_data(f'pmtiles_metadata/{data_id}.json')
        route.fulfill(json=json_data, headers=CORS_HEADERS)
    except FileNotFoundError:
        print(
            f'[MOCK API] File pmtiles_metadata/{data_id}.json NOT found. Returning default metadata.'
        )
        route.fulfill(json=DEFAULT_METADATA, headers=CORS_HEADERS)

from playwright.sync_api import Route


def handle_pmtiles_metadata_api(route: Route) -> None:
    """
    Fulfill `{dname}.metadata` sidecar GETs so Playwright does not depend on
    live S3. HTTP 200 is enough for the app to treat the collection as
    PMTiles-supported.
    """
    print(
        f'[MOCK API] handle_pmtiles_metadata_api called for URL: {route.request.url}'
    )
    route.fulfill(
        status=200,
        content_type='application/json',
        headers={'access-control-allow-origin': '*'},
        json={
            'min_date': 20100101,
            'max_date': 20201231,
            'time_group_by': 'all',
            'has_time': True,
        },
    )

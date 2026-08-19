from playwright.sync_api import Route


def handle_manage_info_api(route: Route) -> None:
    """AdminScreen fetches this on every page mount; CI has no OGC backend."""
    route.fulfill(
        json={
            'application': {
                'name': 'ogcapi-server-java',
                'description': 'REST API that implements OGC API',
                'version': 'playwright',
            },
            'git': {'commit': {'id': 'test'}},
            'depService': {},
        }
    )

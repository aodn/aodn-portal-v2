from playwright.sync_api import Route


def handle_geowebcache_api(route: Route) -> None:
    route.fulfill(json={})  # Response not needed in the UI tests

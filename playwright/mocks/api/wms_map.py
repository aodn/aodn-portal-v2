from typing import Callable

from playwright.sync_api import Route


def handle_wms_map_tile_api(route: Route) -> None:
    route.fulfill(json={})  # Response not needed in the UI tests


def create_api_handler(
    is_time_supported: bool, is_geometry_supported: bool
) -> Callable[[Route], None]:
    """Factory function that creates a route handler with specific response."""
    json_data = []
    if is_time_supported:
        json_data.append(
            {'label': 'timestamp', 'type': 'dateTime', 'name': 'timestamp'}
        )
    if is_geometry_supported:
        json_data.append(
            {'label': 'geom', 'type': 'geometrypropertytype', 'name': 'geom'}
        )

    def handler(route: Route) -> None:
        route.fulfill(json=json_data)

    return handler

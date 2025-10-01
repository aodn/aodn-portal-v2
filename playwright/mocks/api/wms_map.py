from playwright.sync_api import Route


def handle_wms_map_tile_api(route: Route) -> None:
    route.fulfill(json={})  # Response not needed in the UI tests

# Hardcode a response with type dateTime field so that the time slider button shown.
# We may need to change it later to allow check on hidden time slider button
def handle_wms_downloadable_fields_api(route: Route) -> None:
    route.fulfill(json=[
        {"label": "timestamp", "type": "dateTime", "name": "timestamp"},
        {"label": "geom", "type": "geometrypropertytype", "name": "geom"}
    ])

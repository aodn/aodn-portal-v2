from collections.abc import Callable
import time

import pytest
from playwright.sync_api import Page, Response, expect

from core.enums.map_layers.layer_style import LayerStyle
from core.factories.layer import LayerFactory
from pages.detail_page import DetailPage

# Map mount / GeojsonLayer paint can lag under CI load (esp. mobile map tab).
_UI_TIMEOUT_MS = 30_000


def _is_products_response(uuid: str) -> Callable[[Response], bool]:
    def _matches(response: Response) -> bool:
        return (
            f'/ext/tiles/collections/{uuid}/products' in response.url
            and response.request.method == 'GET'
        )

    return _matches


@pytest.mark.parametrize(
    'uuid',
    [
        '5e9ea5c7-f86d-425a-b641-7768c3896e6f',  # bbox only; no GeoServer or Data Density
    ],
)
def test_map_shows_only_spatial_extent_layer(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset that has bounding box coordinates but no WMS or summary links.
    It verifies that only the Spatial Extent layer appears on the map.

    This test ensures that:
    1. The Spatial Extent layer option is displayed in the layers menu
    2. The Spatial Extent layer is added to the map and is visible
    """
    detail_page = DetailPage(responsive_page)

    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_map_loading()
    detail_page.detail_map.wait_for_layer_select_loading()
    detail_page.detail_map.wait_for_map_idle()

    # Map resize / idle can dismiss the Popper after a single click (CI/mobile).
    detail_page.detail_map.open_layers_menu_until_visible(
        detail_page.detail_map.spatial_extent_layer
    )

    # GeojsonLayer paints after map idle + selectedMapLayerId === SpatialExtent.
    layer_id = layer_factory.get_layer_id(LayerStyle.SPATIAL_EXTENT)
    layer_visible = False
    deadline = time.monotonic() + (_UI_TIMEOUT_MS / 1000)
    while time.monotonic() < deadline:
        if detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        ):
            layer_visible = True
            break
        detail_page.page.wait_for_timeout(250)
    assert layer_visible is True, (
        f'Spatial Extent layer {layer_id!r} was not visible within '
        f'{_UI_TIMEOUT_MS}ms'
    )


@pytest.mark.parametrize(
    'uuid',
    [
        '27cc65c0-d453-4ba3-a0d6-55e4449fee8c',  # Zarr data, has bbox, Geoserver, and Gridded Data
    ],
)
def test_map_hides_spatial_extent_when_gridded_data_is_available(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a ZARR dataset with a WMS link, bounding box coordinates,
    and gridded raster products. It verifies that Gridded Data takes priority
    over Spatial Extent: the record otherwise qualifies for Spatial Extent
    (zarr + bbox), but that option must not be offered once gridded products
    are available.

    This test ensures that:
    1. GeoServer and Gridded Data are both offered in the layers menu
    2. Spatial Extent is not offered
    3. The GeoServer layer is present and visible on the map
    """
    detail_page = DetailPage(responsive_page)

    layer_factory = LayerFactory(detail_page.detail_map)

    # Spatial Extent is offered until discovery returns products; only then
    # is it suppressed. Wait for that response (mobile: after Map tab).
    with responsive_page.expect_response(
        _is_products_response(uuid), timeout=_UI_TIMEOUT_MS
    ):
        detail_page.load(uuid)
        detail_page.go_to_map_tab()

    # Idle/resize can close the Popper; Gridded Data is the late radio.
    detail_page.detail_map.open_layers_menu_until_visible(
        detail_page.detail_map.gridded_data_layer
    )
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()
    expect(detail_page.detail_map.spatial_extent_layer).to_have_count(0)

    layer_id = layer_factory.get_layer_id(LayerStyle.GEO_SERVER)
    detail_page.detail_map.wait_until_map_layer_visible(
        layer_id, timeout_ms=_UI_TIMEOUT_MS
    )


@pytest.mark.parametrize(
    'uuid',
    [
        'd9199700-cdda-4d18-bce7-fc0aeee55ba1',  # No bbox or WMS or summary links
    ],
)
def test_map_shows_preview_not_available(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset that doesn't have bounding box coordinates, WMS links, or summary links.
    It verifies that map shows 'Dataset preview is not available' announcement.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_map_idle()
    expect(detail_page.detail_map.announcement_panel).to_have_text(
        'Dataset preview is not available'
    )

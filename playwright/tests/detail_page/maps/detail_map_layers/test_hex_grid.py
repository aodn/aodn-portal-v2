import pytest
from playwright.sync_api import Page, expect

from core.enums.layer_type import LayerType
from core.factories.layer import LayerFactory
from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_map_shows_hexgrid_layer(responsive_page: Page, uuid: str) -> None:
    """
    This test uses a non-ZARR dataset with both summary and WMS links.
    It verifies that both the Hex Grid layer and the GeoServer layer appear on the map.

    This test ensures that:
    1. The Hex Grid layer option is displayed in the layers menu
    2. The Hex Grid layer is added to the map and visible by default
    3. The GeoServer layer option is displayed in the layers menu
    4. The GeoServer layer is added to the map and visible
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.detail_map.wait_for_map_loading()

    # Ensure that the Hex Grid and GeoServer options are displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.hex_grid_layer).to_be_visible()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Verify that the Hex Grid layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.HEX_GRID)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is True
    # Verify that the Geoserver layer is present and visible on the map
    detail_page.detail_map.geoserver_layer.check()
    detail_page.detail_map.wait_for_map_idle()
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

import pytest
from playwright.sync_api import Page, expect

from core.enums.map_layers.layer_style import LayerStyle
from core.factories.layer import LayerFactory
from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_map_shows_data_density_layer(responsive_page: Page, uuid: str) -> None:
    """
    This test uses a non-ZARR dataset with PMTiles density and WMS links.
    It verifies that both the Data Density (PMTiles) layer and the GeoServer
    layer appear on the map.

    This test ensures that:
    1. The Data Density layer option is displayed in the layers menu
    2. The Data Density layer is selected / visible by default
    3. The GeoServer layer option is displayed in the layers menu
    4. The GeoServer layer can be selected and is visible on the map
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()

    # Data Density appears after the mocked `.metadata` sidecar probe.
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.data_density_layer).to_be_visible(
        timeout=30_000
    )
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Verify that Data Density is present and visible on the map by default
    layer_id = layer_factory.get_layer_id(LayerStyle.DATA_DENSITY)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is True
    # Verify that the Geoserver layer is present and visible on the map
    detail_page.detail_map.geoserver_layer.check()
    detail_page.detail_map.wait_for_map_idle()
    layer_id = layer_factory.get_layer_id(LayerStyle.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

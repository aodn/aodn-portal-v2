import pytest
from playwright.sync_api import Page, expect

from core.enums.layer_type import LayerType
from core.factories.layer import LayerFactory
from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid',
    [
        '5e9ea5c7-f86d-425a-b641-7768c3896e6f',  # contains bbox and no Geoserver or Hexbin layer
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
    detail_page.detail_map.wait_for_map_loading()

    # Ensure that the Spatial Extent option is displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.spatial_extent_layer).to_be_visible()

    # Verify that the Spatial Extent layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.SPATIAL_EXTENT)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is True


@pytest.mark.parametrize(
    'uuid',
    [
        '19da2ce7-138f-4427-89de-a50c724f5f54',
    ],
)
def test_map_shows_both_geoserver_and_spatial_extent_layer(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a ZARR dataset with a WMS link and has bounding box coordinates.
    It verifies that both the GeoServer and Spatial Extent layers appear on the map.

    This test ensures that:
    1. The Spatial Extent layer option is displayed in the layers menu
    2. Both the GeoServer layer and the Spatial Extent layer are added to the map and visible
    """
    detail_page = DetailPage(responsive_page)

    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.detail_map.wait_for_map_loading()

    # Ensure that both the GeoServer and Spatial Extent options are displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()
    expect(detail_page.detail_map.spatial_extent_layer).to_be_visible()

    # Verify that the Geoserver layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

    # Verify that the Spatial Extent layer is present and visible on the map
    detail_page.detail_map.spatial_extent_layer.check()
    detail_page.detail_map.wait_for_map_idle()
    layer_id = layer_factory.get_layer_id(LayerType.SPATIAL_EXTENT)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is True


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
    It verifies that map shows 'Map Preview Not Available' announcement.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    detail_page.detail_map.wait_for_map_idle()
    expect(detail_page.detail_map.announcement_panel).to_have_text(
        'Map Preview Not Available'
    )

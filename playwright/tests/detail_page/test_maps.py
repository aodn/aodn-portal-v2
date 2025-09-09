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
def test_drawing_shape_adds_download_filter(
    desktop_page: Page, uuid: str
) -> None:
    """
    Verifies that drawing a rectangular shape on the detail map
    creates a download filter item.
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)
    detail_page.wait_for_timeout(1000)

    # Draw a rectangle on the map
    detail_page.detail_map.draw_rect_menu_button.click()
    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()
    x, y = detail_page.detail_map.calculate_mouse_coordinates(
        right=100, down=100
    )
    detail_page.mouse.move(x, y)
    detail_page.detail_map.click_map()
    expect(detail_page.bbox_condition_box).to_be_visible()

    # Remove the drawn shape
    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()
    detail_page.detail_map.delete_button.click()
    expect(detail_page.bbox_condition_box).not_to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_selecting_date_range_adds_download_filter(
    desktop_page: Page, uuid: str
) -> None:
    """
    Verifies that selecting a date range via the slider
    creates a download filter item.
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    # Select date range show/hide menu
    detail_page.detail_map.daterange_show_hide_menu_button.click()

    # Select a date range using the slider
    detail_page.detail_map.date_slider.hover()
    detail_page.detail_map.click_map()
    expect(detail_page.date_range_condition_box).to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_spatial_map_click_zooms_detail_map(
    desktop_page: Page, uuid: str
) -> None:
    """
    Verifies that clicking within the Spatial Coverage map
    correctly zooms the detail page map to the selected area.
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)
    detail_page.wait_for_timeout(2000)

    # Click on the spatial map
    detail_page.spatial_map.hover_map()
    detail_page.spatial_map.click_map()
    detail_page.wait_for_timeout(2000)

    click_lng_lat = detail_page.spatial_map.get_map_click_lng_lat()
    new_detail_map_center = detail_page.detail_map.get_map_center()

    assert round(click_lng_lat['lng']) == round(new_detail_map_center['lng'])
    assert round(click_lng_lat['lat']) == round(new_detail_map_center['lat'])


@pytest.mark.parametrize(
    'uuid',
    [
        '1fba3a57-35f4-461b-8a0e-551af229714e',
    ],
)
def test_map_shows_geoserver_layer_when_wms_link_present(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset with a valid WMS link and verifies
    that the Geoserver layer appears when the WMS link is present.

    This test ensures that:
    1. The WMS link header is visible in the UI
    2. The map does not display a "preview not available" announcement
    3. A Geoserver WMS layer is added to the map and is visible
    """
    detail_page = DetailPage(responsive_page)

    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    expect(detail_page.wms_link_header).to_be_visible()
    expect(
        detail_page.detail_map.map_preview_not_available_announcement
    ).not_to_be_visible()

    # Verify that the Geoserver WMS layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )


@pytest.mark.parametrize(
    'uuid',
    [
        '5e9ea5c7-f86d-425a-b641-7768c3896e6f',
    ],
)
def test_map_not_showing_geoserver_layer_preview_when_wms_link_absent(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset specifically chosen to lack WMS links and verifies
    that no Geoserver layer preview appears when the WMS link is absent.

    This test ensures that:
    1. The WMS link header is not visible in the UI
    2. The map displays a "preview not available" announcement
    3. No Geoserver WMS layer is added to the map
    """
    detail_page = DetailPage(responsive_page)

    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    expect(detail_page.wms_link_header).not_to_be_visible()
    expect(
        detail_page.detail_map.map_preview_not_available_announcement
    ).to_be_visible()

    # Verify that the Geoserver layer is not present on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is False


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',  # This dataset includes a link with rel="summary"
    ],
)
def test_map_shows_hexbin_and_symbol_layers(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset specifically chosen to include a summary link and verifies
    that both Hexbin can be previewed and toggled on the map.

    This test ensures that:
    1. Both Hexbin options are displayed in the layers menu
    2. The Hexbin layer is added to the map and is visible by default
    """
    detail_page = DetailPage(responsive_page)

    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.detail_map.layers_menu.click()
    # Ensure both Hexbin options are displayed in the layers menu
    # This is a zarr dataset. Hexbin should be instead of spatial extent for a short term solution
    expect(detail_page.detail_map.hexbin_layer).to_be_visible()

# Verify that the Hexbin layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.HEXBIN)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is True
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

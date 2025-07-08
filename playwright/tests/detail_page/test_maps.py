import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage

@pytest.mark.xfail(reason="LayersIcon element not found - UI issue") # todo search page map right-top icon changed causing playwright error
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

    # Select the Hexbin layer
    detail_page.detail_map.layers_icon.click()
    detail_page.detail_map.hexbin_layer.click()
    detail_page.detail_map.draw_rect_menu_button.click()

    # Draw a rectangle on the map
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

@pytest.mark.xfail(reason="LayersIcon element not found - UI issue") # todo search page map right-top icon changed causing playwright error
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

    # Select the Hexbin layer
    detail_page.detail_map.layers_icon.click()
    detail_page.detail_map.hexbin_layer.click()
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

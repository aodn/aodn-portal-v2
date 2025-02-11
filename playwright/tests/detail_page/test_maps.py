import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_drawing_shape_adds_download_filter(page_mock: Page, uuid: str) -> None:
    """
    Verifies that drawing a rectangular shape on the detail map
    creates a download filter item.
    """
    detail_page = DetailPage(page_mock)
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
    page_mock: Page, uuid: str
) -> None:
    """
    Verifies that selecting a date range via the slider
    creates a download filter item.
    """
    detail_page = DetailPage(page_mock)
    detail_page.load(uuid)

    # Select a date range using the slider
    detail_page.detail_map.daterange_show_hide_menu_button.click()
    detail_page.detail_map.date_slider.hover()
    detail_page.detail_map.click_map()
    expect(detail_page.date_range_condition_box).to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_spatial_map_click_zooms_detail_map(page_mock: Page, uuid: str) -> None:
    """
    Verifies that clicking within the Spatial Coverage map
    correctly zooms the detail page map to the selected area.

    The test verifies that:
    1. Initially, the detail map center is NOT within ±1 degree of the spatial map center
    2. After clicking, the detail map center IS within ±1 degree of the spatial map center
    """

    def is_within_tolerance(
        coord1: dict, coord2: dict, tolerance: float = 1.0
    ) -> bool:
        """
        Check if two coordinate points are within the specified tolerance.

        Args:
            coord1: First coordinate point with 'lng' and 'lat' keys
            coord2: Second coordinate point with 'lng' and 'lat' keys
            tolerance: Maximum allowed difference in degrees (default: 1.0)

        Returns:
            bool: True if coordinates are within tolerance, False otherwise
        """
        return (
            abs(coord1['lng'] - coord2['lng']) <= tolerance
            and abs(coord1['lat'] - coord2['lat']) <= tolerance
        )

    detail_page = DetailPage(page_mock)
    detail_page.load(uuid)
    detail_page.wait_for_timeout(1000)

    detail_map_center = detail_page.detail_map.get_map_center()
    spatial_map_center = detail_page.spatial_map.get_map_center()

    # Verify initial centers are NOT within tolerance
    assert not is_within_tolerance(detail_map_center, spatial_map_center), (
        f'Initial detail map center {detail_map_center} should NOT be within ±1 degree of '
        f'spatial map center {spatial_map_center}'
    )

    # Click on the spatial map
    detail_page.spatial_map.hover_map()
    detail_page.spatial_map.click_map()
    detail_page.wait_for_timeout(1000)

    new_detail_map_center = detail_page.detail_map.get_map_center()

    # Verify new center IS within tolerance
    assert is_within_tolerance(new_detail_map_center, spatial_map_center), (
        f'New detail map center {new_detail_map_center} should be within ±1 degree of '
        f'spatial map center {spatial_map_center}'
    )
    page_mock.pause()

import pytest
from playwright.sync_api import Page, expect

from core.enums.map_layers.layer_style import LayerStyle
from core.factories.layer import LayerFactory
from pages.detail_page import DetailPage
from utils.map_utils import (
    are_coordinates_equal,
    are_value_equal,
    is_bbox_contained_by_map_bounds,
)


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
    detail_page.detail_map.wait_for_layer_select_loading()

    # Draw a rectangle on the map
    detail_page.detail_map.draw_rect_menu_button.click()
    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()
    x, y = detail_page.detail_map.calculate_mouse_coordinates(
        right=100, down=100
    )
    detail_page.mouse.move(x, y)
    detail_page.detail_map.click_map()
    expect(detail_page.bbox_condition_box.first).to_have_css(
        'visibility', 'visible', timeout=5000
    )

    # Remove the drawn shape
    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()
    detail_page.detail_map.delete_button.click()
    expect(detail_page.bbox_condition_box.first).not_to_be_visible()


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
    detail_page.wait_for_timeout(2000)

    # Select date range show/hide menu
    detail_page.detail_map.daterange_show_hide_menu_button.click()

    # Select a date range using the slider
    detail_page.detail_map.date_slider.hover()
    detail_page.detail_map.click_map()
    expect(detail_page.date_range_condition_box).to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '40e9283b-d4ed-4176-8fe6-112b8697003f',
    ],
)
def test_spatial_map_click_zooms_detail_map(
    desktop_page: Page, uuid: str
) -> None:
    """
    Verifies that clicking a spatial extent polygon on the Spatial Coverage map fits the detail page map to the bounding box of the clicked polygon.

    The second bbox [110.6, -24.0, 111.4, -23.317] from the mock data is targeted by clicking at its centroid. The detail map should then fit to that polygon's full bounding box, so the bbox must be fully contained within the detail map's
    visible bounds.
    """
    # Second bbox in the mock data's extent.spatial.bbox array: [west, south, east, north]
    target_bbox = [
        110.6000000003,
        -23.9999999996,
        111.4000000005,
        -23.316666667,
    ]
    bbox_center_lng = (target_bbox[0] + target_bbox[2]) / 2
    bbox_center_lat = (target_bbox[1] + target_bbox[3]) / 2

    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)
    detail_page.wait_for_timeout(2000)

    # Fire a programmatic click at the centroid of the target polygon
    detail_page.spatial_map.fire_click_at_lng_lat(
        bbox_center_lng, bbox_center_lat
    )
    detail_page.wait_for_timeout(2000)

    # The detail map should now be fitted to the clicked polygon's full bbox
    detail_map_bounds = detail_page.detail_map.get_map_bounds()
    assert is_bbox_contained_by_map_bounds(
        target_bbox, detail_map_bounds
    ), f'Detail map bounds {detail_map_bounds} do not contain clicked bbox {target_bbox}'


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_map_state_persists_after_tab_navigation(
    desktop_page: Page, uuid: str
) -> None:
    """
    Verifies that the map's state (center coordinates and zoom level) persists
    after navigating between tabs.

    The test loads a detail page, drags and zooms the detail map, captures the map's state,
    and then navigates to another tab and back to verify that the map's state remains unchanged.
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)
    detail_page.wait_for_timeout(3000)

    # Drag and zoom the map
    detail_page.detail_map.zoom_in()
    detail_page.wait_for_timeout(3000)
    detail_page.detail_map.drag_map()
    detail_page.wait_for_timeout(3000)

    map_center = detail_page.detail_map.get_map_center()
    map_zoom = detail_page.detail_map.get_map_zoom()

    # Navigate to the "Data Access" tab and back
    detail_page.tabs.data_access.tab.click()
    detail_page.wait_for_timeout(3000)
    detail_page.tabs.summary.tab.click()
    detail_page.wait_for_timeout(3000)

    # Verify that the map's center and zoom level persist
    new_map_center = detail_page.detail_map.get_map_center()
    new_map_zoom = detail_page.detail_map.get_map_zoom()
    assert are_coordinates_equal(map_center, new_map_center, tolerance=0.1)
    assert are_value_equal(map_zoom, new_map_zoom, tolerance=0.2)


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_map_layer_persists_after_tab_navigation(
    desktop_page: Page, uuid: str
) -> None:
    """
    Verifies that the map's layer persists after navigating between tabs.

    The test loads a detail page, selects a map layer, navigates to another tab and back,
    and then verifies that the selected map layer remains active and visible.
    """
    detail_page = DetailPage(desktop_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.detail_map.wait_for_map_loading()

    # Ensure that the Hex Grid and GeoServer options are displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.hex_grid_layer).to_be_visible()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Select Geoserver layer
    detail_page.detail_map.geoserver_layer.check()
    detail_page.detail_map.wait_for_map_idle()

    # Navigate to the "Data Access" tab and back
    detail_page.tabs.data_access.tab.click()
    expect(detail_page.tabs.data_access.data).to_be_visible()
    detail_page.tabs.summary.tab.click()
    expect(detail_page.tabs.summary.description.first).to_be_visible()

    # Verify that the Geoserver layer is present and visible on the map
    detail_page.detail_map.wait_for_map_idle()
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.geoserver_layer).to_be_checked()
    layer_id = layer_factory.get_layer_id(LayerStyle.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

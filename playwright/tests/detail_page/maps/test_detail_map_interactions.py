import pytest
from playwright.sync_api import Locator, Page, expect

from core.enums.map_layers.layer_style import LayerStyle
from core.factories.layer import LayerFactory
from mocks.routes import Routes
from pages.detail_page import DetailPage
from utils.map_utils import (
    are_coordinates_equal,
    are_value_equal,
    is_bbox_contained_by_map_bounds,
)

# PMTiles .metadata sidecar probe and WMS layer list can lag under CI load.
_UI_TIMEOUT_MS = 30_000


def _open_layers_menu_until_visible(
    detail_page: DetailPage, locator: Locator, timeout_ms: int = _UI_TIMEOUT_MS
) -> None:
    """
    Open the layer styles menu and wait until ``locator`` is visible.

    Map resize / idle events can dismiss the Popper immediately after click
    (especially under Grid layout reflows). Re-open only when the menu is
    closed so we do not toggle it shut while waiting for PMTiles options.
    """
    detail_map = detail_page.detail_map
    page = detail_page.page
    layers_menu_panel = page.get_by_test_id('layer-style-menu-items')
    expect(detail_map.layers_menu).to_be_visible(timeout=timeout_ms)

    deadline = page.evaluate('() => Date.now()') + timeout_ms
    last_error = None
    while page.evaluate('() => Date.now()') < deadline:
        # Only click when the menu is closed; avoid toggling it closed while
        # radios are still mounting (PMTiles .metadata sidecar probe).
        if not layers_menu_panel.is_visible():
            detail_map.layers_menu.click()
        try:
            expect(locator).to_be_visible(timeout=2_000)
            return
        except AssertionError as exc:
            last_error = exc
            page.wait_for_timeout(200)
    if last_error is not None:
        raise last_error
    expect(locator).to_be_visible(timeout=1_000)


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
    detail_page.detail_map.reset_selections_button.click()
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
    # GeoServer layer-select and the PMTiles .metadata sidecar probe can lag under CI load.
    detail_page.detail_map.wait_for_layer_select_loading()
    detail_page.detail_map.wait_for_map_idle()

    # Ensure that Data Density (PMTiles) and GeoServer options are in the layers menu.
    # Data Density mounts only after the PMTiles .metadata sidecar exists.
    _open_layers_menu_until_visible(
        detail_page, detail_page.detail_map.data_density_layer
    )
    expect(detail_page.detail_map.geoserver_layer).to_be_visible(
        timeout=_UI_TIMEOUT_MS
    )

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
    _open_layers_menu_until_visible(
        detail_page, detail_page.detail_map.geoserver_layer
    )
    expect(detail_page.detail_map.geoserver_layer).to_be_checked(
        timeout=_UI_TIMEOUT_MS
    )
    layer_id = layer_factory.get_layer_id(LayerStyle.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )


@pytest.mark.parametrize(
    'uuid, first_data_title, last_data_title, last_data_value',
    [
        (
            '69e9ac91-babe-47ed-8c37-0ef08f29338a',
            'Hillshaded multi-resolution aspect-slope composite for the Aus EEZ',
            'Hillshaded multi-resolution bathymetric slope composite for the Aus EEZ',
            'AusEEZ_bathy_slope_composite_multires',
        ),
    ],
)
def test_layer_selection_triggers_correct_wms_map_tile_request(
    responsive_page: Page,
    uuid: str,
    first_data_title: str,
    last_data_title: str,
    last_data_value: str,
) -> None:
    """
    Verifies that selecting a layer from the dataset selection dropdown triggers
    a WMS map tile request with the correct layer data value.
    """
    detail_page = DetailPage(responsive_page)
    detail_page.load(uuid)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()

    detail_page.dataset_selection_dropdown.click()
    expect(detail_page.get_text(first_data_title).first).to_be_visible()
    expect(detail_page.get_text(last_data_title)).to_be_visible()

    # Verify that selecting the last layer triggers a map tile request with the correct layer parameter
    with responsive_page.expect_response(Routes.WMS_MAP_TILE) as response_info:
        detail_page.get_text(last_data_title).click()
        response = response_info.value
        assert (
            last_data_value in response.url
        ), f'Unexpected URL: {response.url}'

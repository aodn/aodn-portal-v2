import pytest
from playwright.sync_api import Page, expect

from core.enums.layer_type import LayerType
from core.factories.layer import LayerFactory
from mocks.api.collections import (
    handle_collections_all_api,
    handle_collections_centroid_api,
    handle_collections_update_all_api,
    handle_collections_update_centroid_api,
)
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage
from utils.map_utils import are_coordinates_equal, are_value_equal


def test_map_drag_updates_search_results(desktop_page: Page) -> None:
    """
    Validates that dragging the map initiates a new search, updating the search
    results displayed in the result list.

    The test compares the initial search result with the updated result, using
    distinct mocked API responses for the search action.
    By mocking different data for the initial and updated API calls, the test
    ensures the UI correctly reflects the expected changes in the search
    results after the map drag event.
    """
    api_router = ApiRouter(page=desktop_page)
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    initial_data = search_page.first_result_title.inner_text()

    # Change api mocking to get updated mocked response after the map drag event
    api_router.route_collection(
        handle_collections_update_centroid_api,
        handle_collections_update_all_api,
    )
    search_page.map.drag_map()
    search_page.wait_for_timeout(3000)  # wait for the search results to update
    updated_data = search_page.first_result_title.inner_text()

    assert initial_data != updated_data


@pytest.mark.parametrize(
    'search_text, updated_search_text',
    [
        ('imos', 'plankton'),
    ],
)
def test_map_updates_on_search_change(
    desktop_page: Page, search_text: str, updated_search_text: str
) -> None:
    """
    Confirms that performing a new search by updating the search text also updates
    the map to display a different set of data.

    The test uses mocked API responses to provide distinct data for the initial and
    updated search actions, verifying that the map correctly loads the updated data.
    By comparing the map layers before and after the search text change, the test
    ensures that the UI's search update properly refreshes the map's layers,
    reflecting the new search results.
    """
    api_router = ApiRouter(page=desktop_page)
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.fill_search_text(search_text)
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    expect(search_page.first_result_title).to_be_visible()
    map_layers = search_page.map.get_map_layers()

    # Change api mocking to get updated response after search action
    api_router.route_collection(
        handle_collections_update_centroid_api,
        handle_collections_update_all_api,
    )
    search_page.search.fill_search_text(updated_search_text)
    search_page.search.click_search_button()
    search_page.wait_for_timeout(2000)
    updated_map_layers = search_page.map.get_map_layers()

    assert map_layers != updated_map_layers


@pytest.mark.parametrize(
    'layer_text, layer_type',
    [
        (
            'Australian Marine Parks',
            LayerType.MARINE_PARKS,
        ),
        (
            'World Boundaries and Places',
            LayerType.WORLD_BOUNDARIES,
        ),
    ],
)
def test_map_reference_layers(
    desktop_page: Page, layer_text: str, layer_type: LayerType
) -> None:
    """
    Validates that selecting a reference layer from the map menu correctly
    displays the corresponding layer on the map and toggling it off hides the layer.

    The test confirms the selection functionality by verifying that the map shows the
    expected layer for the chosen reference layer and ensures the layer is hidden
    when deselected, confirming the UI's layer toggle behavior works as intended.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    layer_factory = LayerFactory(search_page.map)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    expect(search_page.first_result_title).to_be_visible()

    search_page.map.reference_layer_menu.click()
    search_page.click_text(layer_text)
    layer_id = layer_factory.get_layer_id(layer_type)
    assert search_page.map.is_map_layer_visible(layer_id) is True

    if not search_page.get_text(layer_text).is_visible():
        search_page.map.reference_layer_menu.click()
    search_page.click_text(layer_text)
    assert search_page.map.is_map_layer_visible(layer_id) is False


@pytest.mark.parametrize(
    'spider_lng, spider_lat',
    [
        (
            '137.70',
            '-33.174',
        ),
    ],
)
def test_map_spider(
    desktop_page: Page,
    spider_lng: str,
    spider_lat: str,
) -> None:
    """
    Confirms that clicking a clustered data point on the map displays the
    individual data points as a spider layer.

    The test zooms to a specific map level and centers the map at given coordinates
    to locate a cluster, then verifies that clicking the cluster reveals the spider
    layer, ensuring the cluster selection and spider visualization function correctly in the UI.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.zoom_to_level(12)
    search_page.map.center_map(spider_lng, spider_lat)
    search_page.wait_for_timeout(5000)

    # Try to find and click a cluster
    cluster_found = search_page.map.find_and_click_cluster()
    assert cluster_found is True

    layer_factory = LayerFactory(search_page.map)
    layer_id = layer_factory.get_layer_id(LayerType.SPIDER)
    assert search_page.map.is_map_layer_visible(layer_id) is True


def test_map_state_persists_with_url(desktop_page: Page) -> None:
    """
    Verifies that the map's state (center coordinates and zoom level) persists
    when reloading the page using the same URL.

    The test performs a search, drags and zooms the map, captures the map's state,
    and then opens a new tab with the same URL to confirm that the map's center
    and zoom level remain consistent, ensuring the UI correctly preserves the
    map state via the URL.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.drag_map()
    search_page.map.zoom_to_level()
    search_page.wait_for_search_to_complete()

    map_center = search_page.map.get_map_center()
    map_zoom = search_page.map.get_map_zoom()

    # Use the current page URL and open a new tab with the same URL
    current_url = search_page.url
    new_page = desktop_page.context.new_page()

    # Add API mocking to the new page
    api_router = ApiRouter(new_page)
    api_router.route_collection(
        handle_collections_centroid_api,
        handle_collections_all_api,
    )

    new_search_page = SearchPage(new_page)
    new_search_page.goto(current_url)
    new_search_page.wait_for_search_to_complete()

    new_map_center = new_search_page.map.get_map_center()
    new_map_zoom = new_search_page.map.get_map_zoom()

    assert are_coordinates_equal(map_center, new_map_center)
    assert map_zoom == new_map_zoom


def test_map_state_persists_across_page(desktop_page: Page) -> None:
    """
    Verifies that the map's state (center coordinates and zoom level) persists
    after navigating to a detail page and returning to the search page.

    The test conducts a search, drags and zooms the map, captures the initial map
    state, navigates to a detail page, and returns to the search page, verifying
    that the map's center and zoom level remain unchanged, ensuring the UI
    maintains the map state across page navigation.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.drag_map()
    search_page.map.zoom_to_level()
    search_page.wait_for_search_to_complete()

    map_center = search_page.map.get_map_center()
    map_zoom = search_page.map.get_map_zoom()

    search_page.first_result_title.click()
    detail_page.return_button.click()

    new_map_center = search_page.map.get_map_center()
    new_map_zoom = search_page.map.get_map_zoom()

    assert are_coordinates_equal(map_center, new_map_center)
    assert are_value_equal(map_zoom, new_map_zoom)


@pytest.mark.parametrize(
    'data_title',
    [
        'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
    ],
)
def test_map_buttons(desktop_page: Page, data_title: str) -> None:
    """
    Ensures that the map buttons on both the search page and the detail page are displayed correctly.

    This test addresses a previously identified issue where modifications to the search page map buttons
    caused the detail page map buttons to disappear. By verifying the visibility of map buttons on
    both pages, it ensures that all expected map buttons are present in their respective contexts.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    # Check the visibility of search page map buttons
    expect(search_page.map.bookmarks_icon).to_be_visible()
    expect(search_page.map.basemap_show_hide_menu).to_be_visible()
    expect(search_page.map.reference_layer_menu).to_be_visible()
    expect(search_page.map.layers_menu).to_be_visible()

    search_page.result_title.get_by_text(data_title).click()

    # Check the visibility of detail page map buttons
    expect(detail_page.detail_map.basemap_show_hide_menu).to_be_visible()
    expect(search_page.map.reference_layer_menu).to_be_visible()
    expect(detail_page.detail_map.layers_menu).to_be_visible()
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()
    expect(detail_page.detail_map.delete_button).to_be_visible()

    # Select the Geoserver layer
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.geoserver_layer.click()
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).not_to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).not_to_be_visible()


def test_map_zoom_out_and_drag_does_not_crash(desktop_page: Page) -> None:
    """
    Verifies that zooming out and dragging the map on the search page does not cause the application to crash.

    This test addresses a previously identified bug where such interactions with the map caused the application
    to crash. By performing a sequence of zoom and drag operations at different levels, it ensures that the
    issue is resolved and does not reoccur.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.fill_search_text('imos ships')
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    current_zoom = search_page.map.get_map_zoom()
    search_page.map.zoom_to_level(zoom_level=current_zoom - 1)
    search_page.map.drag_map(left=200)
    search_page.map.wait_for_map_loading()
    search_page.map.zoom_to_level(zoom_level=1)
    search_page.map.drag_map(left=250)

    # Additional drag operation to verify map responsiveness after zooming and dragging
    search_page.map.drag_map(left=200)
    assert True

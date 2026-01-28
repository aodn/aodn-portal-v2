from playwright.sync_api import Page

from mocks.api.collections import (
    handle_collections_all_api,
    handle_collections_centroid_api,
)
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage
from utils.map_utils import are_coordinates_equal, are_value_equal


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
    search_page.wait_for_page_stabilization()

    search_page.map.drag_map()
    search_page.wait_for_page_stabilization()
    search_page.map.zoom_in()
    search_page.wait_for_page_stabilization()

    map_center = search_page.map.get_map_center()
    map_zoom = search_page.map.get_map_zoom()
    search_page.wait_for_url_update()

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
    new_search_page.goto(current_url, wait_until='load')
    new_search_page.map.wait_for_map_idle()

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
    search_page.wait_for_page_stabilization()

    search_page.map.drag_map()
    search_page.wait_for_page_stabilization()
    search_page.map.zoom_in()
    search_page.wait_for_page_stabilization()

    map_center = search_page.map.get_map_center()
    map_zoom = search_page.map.get_map_zoom()

    search_page.first_result_title.click()
    detail_page.return_button.click()
    search_page.map.wait_for_map_loading()

    new_map_center = search_page.map.get_map_center()
    new_map_zoom = search_page.map.get_map_zoom()

    assert are_value_equal(map_zoom, new_map_zoom)
    assert are_coordinates_equal(map_center, new_map_center)

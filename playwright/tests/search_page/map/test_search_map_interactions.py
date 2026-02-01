from playwright.sync_api import Page

from mocks.api.collections import (
    handle_collections_update_all_api,
    handle_collections_update_centroid_api,
)
from mocks.api_router import ApiRouter
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


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
    search_page.wait_for_page_stabilization()
    initial_data = search_page.first_result_title.inner_text()

    # Change api mocking to get updated mocked response after the map drag event
    api_router.route_collection(
        handle_collections_update_centroid_api,
        handle_collections_update_all_api,
    )
    search_page.map.drag_map()
    search_page.wait_for_page_stabilization()
    updated_data = search_page.first_result_title.inner_text()

    assert initial_data != updated_data


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

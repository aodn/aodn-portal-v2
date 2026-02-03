import pytest
from playwright.sync_api import Page, expect

from mocks.api.collections import (
    handle_collections_update_all_api,
    handle_collections_update_centroid_api,
)
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage
from utils.map_utils import are_coordinates_equal, are_value_equal


@pytest.mark.parametrize(
    'search_text, updated_search_text',
    [
        ('imos', 'plankton'),
    ],
)
@pytest.mark.skip(reason='Feature contains a bug and is being investigated.')
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


def test_map_resets_to_default_after_landing_page(desktop_page: Page) -> None:
    """
    This test verifies a previously identified issue where a search is performed,
    the map position is changed, the user navigates to the landing page, then
    to the search page, followed by the detail page, and returns to the search
    page. The test ensures that the search page map always loads at its default
    position (zoom level and center coordinates) after visiting the landing page,
    instead of retaining the previously changed position.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_page_stabilization()

    default_map_center = search_page.map.get_map_center()
    default_map_zoom = search_page.map.get_map_zoom()

    search_page.map.drag_map()
    search_page.map.zoom_in()
    search_page.wait_for_page_stabilization()

    search_page.go_to_landing_page()
    landing_page.search.click_search_button()
    search_page.wait_for_page_stabilization()

    current_map_center = search_page.map.get_map_center()
    current_map_zoom = search_page.map.get_map_zoom()

    assert are_value_equal(current_map_zoom, default_map_zoom)
    assert are_coordinates_equal(current_map_center, default_map_center)

    search_page.first_result_title.click()
    detail_page.return_button.click()
    search_page.map.wait_for_map_loading()

    current_map_center = search_page.map.get_map_center()
    current_map_zoom = search_page.map.get_map_zoom()

    assert are_value_equal(current_map_zoom, default_map_zoom)
    assert are_coordinates_equal(current_map_center, default_map_center)

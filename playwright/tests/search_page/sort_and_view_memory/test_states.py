"""
Search Page Sort/View State Persistence Tests
--------------------------------------------
This file contains tests that verify the persistence of sort and view state settings
across different user interactions and page navigations in the search functionality.

See PR for details - https://github.com/aodn/aodn-portal-v2/pull/332

Test coverage includes:
- State persistence across page navigation
- State persistence after map toggle
- State persistence with URL sharing
- View state handling during screen resize
- View state handling for pasted URLs with different screen sizes
"""

import pytest
from playwright.sync_api import Page, expect

from core.constants.devices import DesktopDevices
from core.enums.search_sort_type import SearchSortType
from core.enums.search_view_layouts import SearchViewLayouts
from mocks.api.collections import (
    handle_collections_all_api,
    handle_collections_centroid_api,
)
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'sort_type, view_type',
    [(SearchSortType.TITLE, SearchViewLayouts.FULL_LIST)],
)
def test_sort_and_view_states_persist_across_page(
    responsive_page: Page,
    sort_type: SearchSortType,
    view_type: SearchViewLayouts,
) -> None:
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)
    detail_page = DetailPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    # Change the sort and view types
    search_page.result_sort_button.click()
    search_page.click_text(sort_type.display_name, exact=True)
    search_page.result_view_button.click()
    search_page.click_text(view_type.display_name, exact=True)

    # Go to the landing page and return to check if the states persist
    search_page.go_to_landing_page()
    landing_page.search.click_search_button()
    expect(
        search_page.get_result_sort_button(sort_type.test_id)
    ).to_be_visible()
    expect(
        search_page.get_result_view_button(view_type.test_id)
    ).to_be_visible()

    # Go to the detail page and return to check if the states persist
    search_page.first_result_title.click()
    detail_page.go_back_button.click()
    expect(
        search_page.get_result_sort_button(sort_type.test_id)
    ).to_be_visible()
    expect(
        search_page.get_result_view_button(view_type.test_id)
    ).to_be_visible()

    # Select full map view and toggle to check if the states persist
    search_page.result_view_button.click()
    search_page.full_map_view_button.click()
    search_page.map_toggle_button.click()
    expect(
        search_page.get_result_sort_button(sort_type.test_id)
    ).to_be_visible()
    expect(
        search_page.get_result_view_button(view_type.test_id)
    ).to_be_visible()


@pytest.mark.parametrize(
    'sort_type, view_type',
    [(SearchSortType.POPULARITY, SearchViewLayouts.GRID)],
)
def test_sort_and_view_states_persist_after_map_toggle(
    desktop_page: Page,
    sort_type: SearchSortType,
    view_type: SearchViewLayouts,
) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.result_sort_button.click()
    search_page.click_text(sort_type.display_name, exact=True)

    search_page.result_view_button.click()
    search_page.click_text(view_type.display_name, exact=True)

    search_page.map_toggle_button.click()
    search_page.map_toggle_button.click()

    expect(
        search_page.get_result_sort_button(sort_type.test_id)
    ).to_be_visible()
    expect(
        search_page.get_result_view_button(view_type.test_id)
    ).to_be_visible()


@pytest.mark.parametrize(
    'sort_type, view_type',
    [(SearchSortType.MODIFIED, SearchViewLayouts.FULL_LIST)],
)
def test_sort_and_view_states_persist_with_url(
    responsive_page: Page,
    sort_type: SearchSortType,
    view_type: SearchViewLayouts,
) -> None:
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.result_sort_button.click()
    search_page.click_text(sort_type.display_name, exact=True)

    search_page.result_view_button.click()
    search_page.click_text(view_type.display_name, exact=True)

    # Use the current page URL and open a new tab with the same URL
    current_url = search_page.url
    new_page = responsive_page.context.new_page()

    # Add API mocking to the new page
    api_router = ApiRouter(new_page)
    api_router.route_collection(
        handle_collections_centroid_api,
        handle_collections_all_api,
    )

    new_search_page = SearchPage(new_page)
    new_search_page.goto(current_url)
    new_search_page.wait_for_search_to_complete()

    expect(
        new_search_page.get_result_sort_button(sort_type.test_id)
    ).to_be_visible()
    expect(
        new_search_page.get_result_view_button(view_type.test_id)
    ).to_be_visible()


@pytest.mark.parametrize(
    'view_type',
    [
        SearchViewLayouts.MAP,
        SearchViewLayouts.FULL_LIST,
        SearchViewLayouts.GRID,
    ],
)
def test_view_states_for_screen_resize(
    desktop_page: Page,
    view_type: SearchViewLayouts,
) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.result_view_button.click()
    search_page.click_text(view_type.display_name, exact=True)

    desktop_page.set_viewport_size(DesktopDevices.SMALL)
    desktop_page.wait_for_timeout(500)  # Wait for the viewport to resize

    if view_type == SearchViewLayouts.MAP:
        expect(search_page.result_list).not_to_be_visible()
        expect(search_page.main_map).to_be_visible()
    else:
        expect(
            search_page.get_result_view_button(
                SearchViewLayouts.FULL_LIST.test_id
            )
        ).to_be_visible()


@pytest.mark.parametrize(
    'view_type',
    [
        SearchViewLayouts.MAP,
        SearchViewLayouts.FULL_LIST,
        SearchViewLayouts.GRID,
    ],
)
def test_view_states_for_paste_url_screen_resize(
    desktop_page: Page,
    view_type: SearchViewLayouts,
) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.result_view_button.click()
    search_page.click_text(view_type.display_name, exact=True)

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
    new_page.set_viewport_size(DesktopDevices.SMALL)
    new_search_page.goto(current_url)
    new_search_page.wait_for_search_to_complete()

    if view_type == SearchViewLayouts.MAP:
        expect(new_search_page.result_list).not_to_be_visible()
        expect(new_search_page.main_map).to_be_visible()
    else:
        expect(
            new_search_page.get_result_view_button(
                SearchViewLayouts.FULL_LIST.test_id
            )
        ).to_be_visible()

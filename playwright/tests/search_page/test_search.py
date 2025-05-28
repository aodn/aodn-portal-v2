import pytest
from playwright.sync_api import Page, expect

from core.enums.search_sort_type import SearchSortType
from mocks.api.search_sort import (
    handle_sort_by_modified,
    handle_sort_by_relevance,
    handle_sort_by_title,
)
from mocks.api_router import ApiRouter
from mocks.apply import apply_mock
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'search_text, category_name',
    [
        ('air', 'air temperature'),
        ('temperature', 'temperature wind'),
    ],
)
def test_basic_search(
    responsive_page: Page, search_text: str, category_name: str
) -> None:
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()
    landing_page.search.fill_search_text(search_text)
    expect(landing_page.get_option(category_name)).to_be_visible()
    landing_page.click_option(category_name)
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    expect(search_page.search.search_field).to_have_value(category_name)
    expect(search_page.first_result_title).to_be_visible()


@pytest.mark.parametrize(
    'sort_type',
    [SearchSortType.TITLE, SearchSortType.MODIFIED],
)
def test_search_result_sort(
    responsive_page: Page, sort_type: SearchSortType
) -> None:
    api_router = ApiRouter(page=responsive_page)
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    api_router.route_collection_all(
        handle_sort_by_relevance
    )  # Sort by relevance is the default sorting type

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    initial_first_title = search_page.first_result_title.inner_text()

    if sort_type == SearchSortType.TITLE:
        api_router.route_collection_all(
            handle_sort_by_title,
        )
    elif sort_type == SearchSortType.MODIFIED:
        api_router.route_collection_all(
            handle_sort_by_modified,
        )

    search_page.result_sort_button.click()
    search_page.click_text(sort_type.display_name, exact=True)

    search_page.wait_for_search_to_complete()
    updated_first_title = search_page.first_result_title.inner_text()

    assert initial_first_title != updated_first_title


@pytest.mark.parametrize(
    'search_text',
    [
        'plankton biomass',
    ],
)
def test_search_input_persistence_after_navigation(
    responsive_page: Page, search_text: str
) -> None:
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)
    detail_page = DetailPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.search.fill_search_text(search_text)
    search_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.first_result_title.click()
    detail_page.go_back_button.click()

    expect(search_page.search.search_field).to_have_value(search_text)


@pytest.mark.parametrize(
    'date, location, filter',
    [('Last Year', 'Australian Marine Parks', 'Parameters')],
)
def test_searchbar_popups(
    responsive_page: Page,
    date: str,
    location: str,
    filter: str,
) -> None:
    landing_page = LandingPage(responsive_page)

    landing_page.load()
    searchbar_popup = landing_page.search.searchbar_popup

    # Test clicking 'Date' button shows the date range selection popup
    landing_page.search.date_button.click()
    expect(searchbar_popup).to_be_visible()
    expect(searchbar_popup).to_contain_text(date)

    # Test clicking 'Location' button shows the location selection popup
    landing_page.search.location_button.click()
    expect(searchbar_popup).to_be_visible()
    expect(searchbar_popup).to_contain_text(location)

    # Test clicking 'Filter' button shows the filters selection popup
    landing_page.search.filter_button.click()
    expect(searchbar_popup).to_be_visible()
    expect(searchbar_popup).to_contain_text(filter)


def set_search_state(
    landing_page: LandingPage,
    date: str,
    location: str,
    filter_parameter: str,
    filter_platform: str,
    filter_organisation: str,
    filter_data: str,
) -> None:
    landing_page.search.date_button.click()
    landing_page.get_text(date).click()
    landing_page.search.location_button.click()
    landing_page.get_text(location).click()
    landing_page.search.filter_button.click()
    landing_page.get_button(filter_parameter).click()
    landing_page.search.filter_platform_tab.click()
    landing_page.search.get_button(filter_platform).click()
    landing_page.search.filter_organisation_tab.click()
    landing_page.search.get_button(filter_organisation).click()
    landing_page.search.filter_data_tab.click()
    landing_page.search.get_button(filter_data).click()


def assert_search_state_persisted(
    search_page: SearchPage,
    date: str,
    location: str,
    filter_parameter: str,
    filter_platform: str,
    filter_organisation: str,
    filter_data: str,
) -> None:
    search_page.search.date_button.click()
    expect(search_page.search.searchbar_popup).to_be_visible()
    expect(search_page.get_radio_input(date)).to_be_checked()

    search_page.search.location_button.click()
    expect(search_page.search.searchbar_popup).to_be_visible()
    expect(search_page.get_radio_input(location)).to_be_checked()

    search_page.search.filter_button.click()
    search_page.search.assert_toggle_button_pressed(filter_parameter)
    search_page.search.filter_platform_tab.click()
    search_page.search.assert_toggle_button_pressed(filter_platform)
    search_page.search.filter_organisation_tab.click()
    search_page.search.assert_toggle_button_pressed(filter_organisation)
    search_page.search.filter_data_tab.click()
    search_page.search.assert_toggle_button_pressed(filter_data)
    search_page.search.filter_button.click()  # close the popup


@pytest.mark.parametrize(
    'date, location, filter_parameter, filter_platform, filter_organisation, filter_data',
    [('Last Year', 'Apollo', 'Carbon', 'Radar', 'IMOS', 'Delayed')],
)
def test_search_state_persists_after_navigation(
    responsive_page: Page,
    date: str,
    location: str,
    filter_parameter: str,
    filter_platform: str,
    filter_organisation: str,
    filter_data: str,
) -> None:
    """
    Verifies that selected search criteria persist across search execution and navigation.

    The test simulates a user setting various search parameters (date, location, filters),
    performing a search, and checks that the search state are correctly applied in the search results page.
    It then navigates to a result's detail page and back. It confirms that all search
    state remain intact throughout this process.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)
    detail_page = DetailPage(responsive_page)

    landing_page.load()

    # Set search state
    set_search_state(
        landing_page,
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data,
    )

    # Perform search
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    # Verify state are applied
    assert_search_state_persisted(
        search_page,
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data,
    )

    # Navigate to detail page and back
    search_page.first_result_title.click()
    detail_page.go_back_button.click()

    # Verify state are still applied after navigation
    assert_search_state_persisted(
        search_page,
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data,
    )


@pytest.mark.parametrize(
    'date, location, filter_parameter, filter_platform, filter_organisation, filter_data',
    [('Last Year', 'Apollo', 'Carbon', 'Radar', 'IMOS', 'Delayed')],
)
def test_search_state_persists_with_url(
    responsive_page: Page,
    date: str,
    location: str,
    filter_parameter: str,
    filter_platform: str,
    filter_organisation: str,
    filter_data: str,
) -> None:
    """
    Verifies that selected search criteria persist when the search results URL is reused in a new browser context.

    The test sets various search parameters, performs a search, and then opens the resulting URL
    in a new tab (simulating link sharing or bookmarking). It confirms that the search state —
    including date, location, and filter state — is correctly restored when the page is reloaded
    from the saved URL.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()

    # Set search state
    set_search_state(
        landing_page,
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data,
    )

    # Perform search
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    # Use the current page URL and open a new tab with the same URL
    current_url = search_page.url
    new_page = responsive_page.context.new_page()

    # Add API mocking to the new page
    apply_mock(new_page)

    new_search_page = SearchPage(new_page)
    new_search_page.goto(current_url)
    new_search_page.wait_for_search_to_complete()

    # Verify state are applied
    assert_search_state_persisted(
        new_search_page,
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data,
    )

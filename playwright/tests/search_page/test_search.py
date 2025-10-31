import pytest
from playwright.sync_api import Page, expect

from core.enums.data_settings_filter import DataSettingsFilter
from core.enums.search_sort_type import SearchSortType
from core.enums.search_view_layouts import SearchViewLayouts
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
    """
    Validates that performing a basic search with a selected category from the
    autocomplete options updates the search field and displays relevant results.

    The test loads the landing page, enters a search term, verifies the specified
    category appears in the autocomplete options, selects the category, initiates
    the search, and confirms that the search field reflects the selected category
    and the first result title is visible, ensuring the UI's search and category
    selection functionality works correctly.
    """
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
    """
    Validates that changing the sort type of search results updates the displayed results.

    The test performs an initial search with default relevance sorting, captures
    the first result title, then changes the sort type (e.g., by title or
    modified date) using mocked API responses to simulate different
    sorting outcomes, and verifies that the first result title
    changes, ensuring the UI shows the updated results.
    """
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
    responsive_page.wait_for_timeout(1000)
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
    """
    Verifies that the search input text persists after navigating to a detail
    page and returning to the search page.

    The test enters a search term, performs a search, navigates to a detail page,
    and returns to the search page, confirming that the search field retains the
    original search text, ensuring the UI correctly preserves the search input
    across page navigation.
    """
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
    detail_page.return_button.click()

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


@pytest.mark.parametrize(
    'date, location, filter_parameter, filter_platform, filter_organisation, filter_data',
    [
        (
            'Last Year',
            'Apollo',
            'Carbon',
            'Radar',
            'IMOS',
            DataSettingsFilter.DELAYED,
        )
    ],
)
def test_search_state_persists_after_navigation(
    responsive_page: Page,
    date: str,
    location: str,
    filter_parameter: str,
    filter_platform: str,
    filter_organisation: str,
    filter_data: DataSettingsFilter,
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
    landing_page.search.set_search_state(
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data.label,
    )

    # Perform search
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    # Verify state are applied
    search_page.search.assert_search_state_persisted(
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data.label,
    )

    # Navigate to detail page and back
    search_page.first_result_title.click()
    detail_page.return_button.click()

    # Verify state are still applied after navigation
    search_page.search.assert_search_state_persisted(
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data.label,
    )


@pytest.mark.parametrize(
    'date, location, filter_parameter, filter_platform, filter_organisation, filter_data',
    [
        (
            'Last Year',
            'Apollo',
            'Carbon',
            'Radar',
            'IMOS',
            DataSettingsFilter.DELAYED,
        )
    ],
)
def test_search_state_persists_with_url(
    responsive_page: Page,
    date: str,
    location: str,
    filter_parameter: str,
    filter_platform: str,
    filter_organisation: str,
    filter_data: DataSettingsFilter,
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
    landing_page.search.set_search_state(
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data.label,
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
    new_search_page.search.assert_search_state_persisted(
        date,
        location,
        filter_parameter,
        filter_platform,
        filter_organisation,
        filter_data.label,
    )


@pytest.mark.parametrize(
    'view_type, location_a, location_b, location_c, location_d',
    [
        (SearchViewLayouts.FULL_LIST, 'Apollo', 'Bremer', 'Franklin', 'Zeehan'),
        (SearchViewLayouts.LIST, 'Apollo', 'Bremer', 'Franklin', 'Zeehan'),
    ],
)
def test_repeated_search_action(
    desktop_page: Page,
    view_type: SearchViewLayouts,
    location_a: str,
    location_b: str,
    location_c: str,
    location_d: str,
) -> None:
    """
    Verifies that performing repeated searches with different locations works correctly.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    # Set view type
    search_page.result_view_button.click()
    search_page.click_text(view_type.display_name, exact=True)

    # Perform first search
    search_page.search.location_button.click()
    search_page.get_radio_input(location_a).check()
    api_url = search_page.search.perform_search_and_get_api_url()
    assert api_url is not None

    # Perform repeated searches with different locations
    # Second Search
    search_page.search.location_button.click()
    search_page.get_radio_input(location_b).check()
    api_url = search_page.search.perform_search_and_get_api_url()
    assert api_url is not None
    # Third search
    search_page.search.location_button.click()
    search_page.get_radio_input(location_c).check()
    api_url = search_page.search.perform_search_and_get_api_url()
    assert api_url is not None
    # Fourth search
    search_page.search.location_button.click()
    search_page.get_radio_input(location_d).check()
    api_url = search_page.search.perform_search_and_get_api_url()
    assert api_url is not None

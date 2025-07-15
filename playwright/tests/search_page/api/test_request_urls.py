from typing import List

import pytest
from playwright.sync_api import Page

from core.dataclasses.search_filter import SearchFilterConfig
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'date, location, filter_parameters, filter_platforms, filter_organisation, filter_data, filter_data_download',
    [
        (
            'Last Year',
            'Apollo',
            ['Carbon', 'Air Quality'],
            ['Radar', 'Vessel'],
            'IMOS',
            'Delayed',
            'Yes',
        )
    ],
)
def test_search_api_request_urls_across_page(
    responsive_page: Page,
    date: str,
    location: str,
    filter_parameters: List[str],
    filter_platforms: List[str],
    filter_organisation: str,
    filter_data: str,
    filter_data_download: str,
) -> None:
    """
    Verifies that search filter selections are correctly reflected in the search API request URLs
    across the user journey.

    The test simulates setting multiple search parameters on the landing page, performing a search,
    and captures the resulting API request URLs. It asserts that these URLs correctly include
    the expected search filters. It then resets all filters, performs another search, and verifies
    that the reset state is properly reflected in the API request URLs. Finally, it navigates
    to a detail page and back, ensuring that the API request after returning also aligns with
    the reset (empty) search state.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)
    detail_page = DetailPage(responsive_page)

    landing_page.load()

    # Set search state
    landing_page.search.set_search_state(
        date,
        location,
        filter_parameters,
        filter_platforms,
        filter_organisation,
        filter_data,
        filter_data_download,
    )

    # Perform search and capture the API URL
    (
        api_url_collection,
        api_url_centroid,
    ) = landing_page.search.perform_search_and_get_api_url()
    start_date, end_date = search_page.search.get_date_range()
    # Define expected search filters
    expected_filters = SearchFilterConfig(
        date_time_start=start_date,
        date_time_end=end_date,
        location_name=location,
        parameter_vocab_labels=filter_parameters,
        platform_vocab_labels=filter_platforms,
        dataset_provider=filter_organisation,
        update_frequency=filter_data,
        download_service_available=filter_data_download is not None,
    )
    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters
    )

    # Reset filters
    search_page.search.reset_all_filters()
    (
        api_url_collection,
        api_url_centroid,
    ) = landing_page.search.perform_search_and_get_api_url()
    # Define expected search filters after reset
    expected_filters_reset = SearchFilterConfig(
        date_time_start=None,
        date_time_end=None,
        location_name=None,
        parameter_vocab_labels=None,
        platform_vocab_labels=None,
        dataset_provider=None,
        update_frequency=None,
        download_service_available=False,
    )
    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters_reset
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters_reset
    )

    # Navigate to detail page and return
    search_page.first_result_title.click()
    return_api_url = detail_page.return_and_get_api_request_url()
    search_page.validate_search_parameters_in_url(
        return_api_url, expected_filters_reset
    )


@pytest.mark.parametrize(
    'date, location, filter_parameters, filter_platforms, filter_organisation, filter_data, filter_data_download',
    [
        (
            'Last Year',
            'Apollo',
            ['Carbon', 'Water Pressure'],
            ['Radar', 'Float'],
            'IMOS',
            'Delayed',
            'Yes',
        )
    ],
)
def test_search_api_request_urls_after_map_state_change(
    responsive_page: Page,
    date: str,
    location: str,
    filter_parameters: List[str],
    filter_platforms: List[str],
    filter_organisation: str,
    filter_data: str,
    filter_data_download: str,
) -> None:
    """
    Verifies that search API request URLs correctly reflect search filters, and remain accurate
    after interacting with the map view.

    The test simulates a user setting various search filters and performing a search, then asserts
    that the generated API request URLs include the expected search parameters. It resets all filters,
    performs another search, and confirms the URLs reflect the cleared state. Finally, it changes
    the map zoom level to simulate user map interaction and verifies that the API URLs remain consistent
    with the reset search state after the map state change.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()

    # Set search state
    landing_page.search.set_search_state(
        date,
        location,
        filter_parameters,
        filter_platforms,
        filter_organisation,
        filter_data,
        filter_data_download,
    )

    # Perform search and capture the API URL
    (
        api_url_collection,
        api_url_centroid,
    ) = landing_page.search.perform_search_and_get_api_url()
    start_date, end_date = search_page.search.get_date_range()
    # Define expected search filters
    expected_filters = SearchFilterConfig(
        date_time_start=start_date,
        date_time_end=end_date,
        location_name=location,
        parameter_vocab_labels=filter_parameters,
        platform_vocab_labels=filter_platforms,
        dataset_provider=filter_organisation,
        update_frequency=filter_data,
        download_service_available=filter_data_download is not None,
    )
    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters
    )

    # Reset filters
    search_page.search.reset_all_filters()
    (
        api_url_collection,
        api_url_centroid,
    ) = landing_page.search.perform_search_and_get_api_url()
    # Define expected search filters after reset
    expected_filters_reset = SearchFilterConfig(
        date_time_start=None,
        date_time_end=None,
        location_name=None,
        parameter_vocab_labels=None,
        platform_vocab_labels=None,
        dataset_provider=None,
        update_frequency=None,
        download_service_available=False,
    )
    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters_reset
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters_reset
    )

    # Change map state
    if not search_page.main_map.is_visible():
        search_page.result_view_button.click()
        search_page.full_map_view_button.click()
    search_page.map.zoom_to_level(5)
    search_page.wait_for_timeout(500)
    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters_reset
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters_reset
    )

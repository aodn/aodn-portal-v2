from typing import List

import pytest
from playwright.sync_api import Page

from core.dataclasses.search_filter import SearchFilterConfig
from core.enums.data_settings_filter import DataSettingsFilter
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'date, location, filter_parameters, filter_platforms, filter_organisation, filter_data, filter_data_download',
    [
        (
            'Last 5 Years',
            'Arafura',
            ['Carbon', 'Air Quality'],
            ['Radar', 'Vessel'],
            'IMOS',
            DataSettingsFilter.DELAYED,
            'Yes',
        )
    ],
)
def test_search_api_request_urls_across_page(
    desktop_page: Page,
    date: str,
    location: str,
    filter_parameters: List[str],
    filter_platforms: List[str],
    filter_organisation: str,
    filter_data: DataSettingsFilter,
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
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()

    # Set search state
    landing_page.search.set_search_state(
        date,
        location,
        filter_parameters,
        filter_platforms,
        filter_organisation,
        filter_data.label,
        filter_data_download,
    )
    start_date, end_date = landing_page.search.get_date_range()
    # Define expected search filters
    expected_filters = SearchFilterConfig(
        date_time_start=start_date,
        date_time_end=end_date,
        location_intersects=landing_page.search.get_selected_location_intersects(),
        parameter_vocab_labels=filter_parameters,
        platform_vocab_labels=filter_platforms,
        dataset_organisation=filter_organisation,
        update_frequency=filter_data._value,
        download_service_available=filter_data_download is not None,
    )

    # Perform search, capture the API URL
    api_url_result = landing_page.perform_action_and_get_api_url(
        action=landing_page.search.click_search_button
    )
    api_url_collection, api_url_centroid = api_url_result

    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters
    )

    # Reset filters
    search_page.search.reset_all_filters()
    # Define expected search filters after reset
    expected_filters_reset = SearchFilterConfig(
        date_time_start=None,
        date_time_end=None,
        location_intersects=None,
        parameter_vocab_labels=None,
        platform_vocab_labels=None,
        dataset_organisation=None,
        update_frequency=None,
        download_service_available=False,
    )

    # Perform search again to capture the API URL after reset
    api_url_result = search_page.perform_action_and_get_api_url(
        action=search_page.search.click_search_button
    )
    api_url_collection, api_url_centroid = api_url_result

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
            DataSettingsFilter.DELAYED,
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
    filter_data: DataSettingsFilter,
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
        filter_data.label,
        filter_data_download,
    )
    start_date, end_date = landing_page.search.get_date_range()
    # Define expected search filters
    expected_filters = SearchFilterConfig(
        date_time_start=start_date,
        date_time_end=end_date,
        location_intersects=landing_page.search.get_selected_location_intersects(),
        parameter_vocab_labels=filter_parameters,
        platform_vocab_labels=filter_platforms,
        dataset_organisation=filter_organisation,
        update_frequency=filter_data._value,
        download_service_available=filter_data_download is not None,
    )

    # Perform search and capture the API URL
    api_url_result = landing_page.perform_action_and_get_api_url(
        action=landing_page.search.click_search_button
    )
    api_url_collection, api_url_centroid = api_url_result

    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters
    )

    # Reset filters
    search_page.search.reset_all_filters()
    # Define expected search filters after reset
    expected_filters_reset = SearchFilterConfig(
        date_time_start=None,
        date_time_end=None,
        location_intersects=None,
        parameter_vocab_labels=None,
        platform_vocab_labels=None,
        dataset_organisation=None,
        update_frequency=None,
        download_service_available=False,
    )

    # Perform search again to capture the API URL after reset
    api_url_result = search_page.perform_action_and_get_api_url(
        action=search_page.search.click_search_button
    )
    api_url_collection, api_url_centroid = api_url_result

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
    api_url_result = search_page.perform_action_and_get_api_url(
        action=search_page.map.zoom_in
    )
    api_url_collection, api_url_centroid = api_url_result

    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters_reset
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters_reset
    )


@pytest.mark.parametrize(
    'date, location, parameters, platforms, organisation, data, data_download, '
    'updated_date, updated_location, updated_parameters, '
    'updated_platforms, updated_organisation, updated_data, updated_data_download',
    [
        (
            'Last 5 Years',
            'Arafura',
            ['Carbon', 'Air Quality'],
            ['Radar'],
            'IMOS',
            DataSettingsFilter.DELAYED,
            'Yes',
            'Last Year',
            'Jervis',
            ['Oxygen'],
            ['Glider', 'Vessel'],
            'CSIRO',
            DataSettingsFilter.REALTIME,
            'Yes',
        )
    ],
)
def test_search_api_request_urls_reflect_parameter_updates(
    responsive_page: Page,
    date: str,
    location: str,
    parameters: List[str],
    platforms: List[str],
    organisation: str,
    data: DataSettingsFilter,
    data_download: str,
    updated_date: str,
    updated_location: str,
    updated_parameters: List[str],
    updated_platforms: List[str],
    updated_organisation: str,
    updated_data: DataSettingsFilter,
    updated_data_download: str,
) -> None:
    """
    Verifies that search API request URLs update correctly when search parameters are changed.

    The test sets initial search parameters, performs a search, and captures the API request URLs.
    It then updates the search parameters, performs another search, and asserts that the new API
    request URLs reflect the updated search parameters.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()

    # Set search state
    landing_page.search.set_search_state(
        date,
        location,
        parameters,
        platforms,
        organisation,
        data.label,
        data_download,
    )
    start_date, end_date = landing_page.search.get_date_range()
    # Define expected search filters
    expected_filters = SearchFilterConfig(
        date_time_start=start_date,
        date_time_end=end_date,
        location_intersects=landing_page.search.get_selected_location_intersects(),
        parameter_vocab_labels=parameters,
        platform_vocab_labels=platforms,
        dataset_organisation=organisation,
        update_frequency=data._value,
        download_service_available=data_download is not None,
    )

    # Perform search and capture the API URL
    api_url_result = landing_page.perform_action_and_get_api_url(
        action=landing_page.search.click_search_button
    )
    api_url_collection, api_url_centroid = api_url_result

    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_filters
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_filters
    )

    # Update search state
    search_page.search.reset_all_filters()  # Reset before update
    search_page.search.set_search_state(
        updated_date,
        updated_location,
        updated_parameters,
        updated_platforms,
        updated_organisation,
        updated_data.label,
        updated_data_download,
    )
    start_date, end_date = search_page.search.get_date_range()
    # Define expected search filters
    expected_updated_filters = SearchFilterConfig(
        date_time_start=start_date,
        date_time_end=end_date,
        location_intersects=search_page.search.get_selected_location_intersects(),
        parameter_vocab_labels=updated_parameters,
        platform_vocab_labels=updated_platforms,
        dataset_organisation=updated_organisation,
        update_frequency=updated_data._value,
        download_service_available=True,
    )

    # Perform search and capture the API URL
    api_url_result = search_page.perform_action_and_get_api_url(
        action=search_page.search.click_search_button
    )
    api_url_collection, api_url_centroid = api_url_result

    search_page.validate_search_parameters_in_url(
        api_url_collection, expected_updated_filters
    )
    search_page.validate_search_parameters_in_url(
        api_url_centroid, expected_updated_filters
    )

from typing import List, Tuple
from urllib.parse import unquote_plus

import pytest
from playwright.sync_api import Page, TimeoutError, expect

from mocks.routes import Routes
from pages.base_page import BasePage
from pages.js_scripts.js_utils import (
    execute_common_js,
    load_common_js_functions,
)


class SearchComponent(BasePage):
    def __init__(self, page: Page):
        self.page = page
        load_common_js_functions(self.page)

        # Page locators
        self.search_field = page.get_by_test_id('input-with-suggester')
        self.search_button = page.get_by_test_id('search-button')
        self.date_button = page.get_by_test_id('date-range-button')
        self.start_date_picker = page.get_by_test_id('start-date-picker')
        self.end_date_picker = page.get_by_test_id('end-date-picker')
        self.location_button = page.get_by_test_id('location-button')
        self.filter_button = page.get_by_test_id('filtersBtn')
        self.searchbar_popup = page.get_by_test_id('searchbar-popup')
        self.filter_parameters_tab = self.get_tab('Parameters')
        self.filter_platform_tab = self.get_tab('Platform')
        self.filter_organisation_tab = self.get_tab('Organisation')
        self.filter_data_tab = self.get_tab('Data')
        self.filter_reset = page.get_by_test_id('ReplayIcon')

    def fill_search_text(self, search_text: str) -> None:
        """Fill up search text"""
        self.search_field.fill(search_text)

    def click_search_button(self) -> None:
        """Click on the search button"""
        self.search_button.click()

    def perform_search_and_get_api_url(self) -> Tuple[str, str]:
        """
        Perform a search by clicking the search button and return the API URL's
        used for the search.
        """
        try:
            with (
                self.page.expect_request(
                    Routes.COLLECTION_ALL
                ) as collections_request_info,
                self.page.expect_request(
                    Routes.COLLECTION_CENTROID
                ) as centroid_request_info,
            ):
                self.click_search_button()
                self.wait_for_timeout(1000)

            collections_request = collections_request_info.value
            centroid_request = centroid_request_info.value

            return (
                unquote_plus(collections_request.url),
                unquote_plus(centroid_request.url),
            )
        except TimeoutError:
            pytest.fail(
                'API URL not found within the timeout, search did not trigger successfully.'
            )

    def get_date_range(self) -> Tuple[str, str]:
        """
        Get the date range from the date range picker.
        """
        self.date_button.click()
        self.wait_for_timeout(500)  # wait for values to load
        start_date = (
            self.start_date_picker.locator('input').get_attribute('value') or ''
        )
        end_date = (
            self.end_date_picker.locator('input').get_attribute('value') or ''
        )
        self.date_button.click()  # close the date picker
        return start_date, end_date

    def get_selected_location_intersects(self) -> str:
        """Get the intersects value of the selected location"""
        return execute_common_js(
            self.page, 'getSelectedLocationIntersects', 'selected-location'
        )

    def assert_toggle_button_pressed(
        self, name: str, pressed: bool = True
    ) -> None:
        button = self.get_button(name)
        expected_value = 'true' if pressed else 'false'
        expect(button).to_have_attribute('aria-pressed', expected_value)

    def set_search_state(
        self,
        date: str,
        location: str,
        filter_parameter: str | List[str],
        filter_platform: str | List[str],
        filter_organisation: str,
        filter_data: str,
        filter_data_download: str = '',
    ) -> None:
        """
        This method simulates user interactions to apply search criteria including date range, location,
        parameters, platforms, organisation, data update frequency, and optionally data availability
        for download.
        """
        self.date_button.click()
        self.get_radio_input(date).click()

        self.location_button.click()
        self.get_radio_input(location).click()

        self.filter_button.click()
        if isinstance(filter_parameter, str):
            self.get_button(filter_parameter, exact=False).click()
        else:
            for parameter in filter_parameter:
                self.get_button(parameter, exact=False).click()

        self.filter_platform_tab.click()
        if isinstance(filter_platform, str):
            self.get_button(filter_platform).click()
        else:
            for platform in filter_platform:
                self.get_button(platform).click()

        self.filter_organisation_tab.click()
        self.get_button(filter_organisation).click()

        self.filter_data_tab.click()
        self.get_button(filter_data).click()
        if filter_data_download != '':
            self.get_button(filter_data_download).click()

    def assert_search_state_persisted(
        self,
        date: str,
        location: str,
        filter_parameter: str,
        filter_platform: str,
        filter_organisation: str,
        filter_data: str,
    ) -> None:
        self.date_button.click()
        expect(self.searchbar_popup).to_be_visible()
        expect(self.get_radio_input(date)).to_be_checked()

        self.location_button.click()
        expect(self.searchbar_popup).to_be_visible()
        expect(self.get_radio_input(location)).to_be_checked()

        self.filter_button.click()
        self.assert_toggle_button_pressed(filter_parameter)
        self.filter_platform_tab.click()
        self.assert_toggle_button_pressed(filter_platform)
        self.filter_organisation_tab.click()
        self.assert_toggle_button_pressed(filter_organisation)
        self.filter_data_tab.click()
        self.assert_toggle_button_pressed(filter_data)
        self.filter_button.click()  # close the popup

    def reset_all_filters(self) -> None:
        """Reset all search filters"""
        self.date_button.click()
        self.wait_for_timeout(500)  # wait for values to load
        self.filter_reset.click()
        self.wait_for_timeout(900)  # wait for date reset
        self.location_button.click()
        self.wait_for_timeout(500)  # wait for values to load
        self.filter_reset.click()
        self.filter_button.click()
        self.wait_for_timeout(500)  # wait for values to load
        self.filter_reset.click()

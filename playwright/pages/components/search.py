from typing import List, Tuple

from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from pages.js_scripts.js_utils import (
    execute_common_js,
    load_common_js_functions,
)


class SearchComponent(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
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

    def search_for(self, query: str) -> None:
        """Fills search input and submits search"""
        self.fill_search_text(query)
        self.click_search_button()

    def get_date_range(self) -> Tuple[str, str]:
        """
        Get the date range from the date range picker.
        """
        self.date_button.click()
        self.wait_for_timeout(1500)  # wait for values to load
        # Ensure values are populated before reading
        self.start_date_picker.locator('input').wait_for(state='visible')
        start_date = self.start_date_picker.locator('input').input_value() or ''
        end_date = self.end_date_picker.locator('input').input_value() or ''
        self.date_button.click()  # close the date picker
        return start_date, end_date

    def get_selected_location_intersects(self) -> str:
        """Get the intersects value of the selected location"""
        return execute_common_js(
            self.page, 'getSelectedLocationIntersects', 'selected-location'
        )

    def assert_toggle_button_pressed(
        self, name: str, pressed: bool = True, exact: bool = True
    ) -> None:
        button = self.get_button(name, exact=exact)
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
        expect(self.get_radio_input(date)).to_be_checked()

        self.location_button.click()
        self.get_radio_input(location).click()
        expect(self.get_radio_input(location)).to_be_checked()

        self.filter_button.click()
        expect(self.searchbar_popup).to_be_visible()
        if isinstance(filter_parameter, str):
            self.get_button(filter_parameter, exact=False).click()
            self.assert_toggle_button_pressed(filter_parameter, exact=False)
        else:
            for parameter in filter_parameter:
                self.get_button(parameter, exact=False).click()
                self.assert_toggle_button_pressed(parameter, exact=False)

        self.filter_platform_tab.click()
        if isinstance(filter_platform, str):
            self.get_button(filter_platform).click()
            self.assert_toggle_button_pressed(filter_platform)
        else:
            for platform in filter_platform:
                self.get_button(platform).click()
                self.assert_toggle_button_pressed(platform)

        self.filter_organisation_tab.click()
        self.get_button(filter_organisation).click()
        self.assert_toggle_button_pressed(filter_organisation)

        self.filter_data_tab.click()
        self.get_button(filter_data).click()
        self.assert_toggle_button_pressed(filter_data)
        if filter_data_download != '':
            self.get_button(filter_data_download).click()
            self.assert_toggle_button_pressed(filter_data_download)

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
        self.wait_for_timeout(1500)  # wait for date reset
        self.location_button.click()
        self.wait_for_timeout(500)  # wait for values to load
        self.filter_reset.click()
        self.wait_for_timeout(1500)  # wait for location reset
        self.filter_button.click()
        self.wait_for_timeout(500)  # wait for values to load
        self.filter_reset.click()
        self.wait_for_timeout(1500)  # wait for other filters reset

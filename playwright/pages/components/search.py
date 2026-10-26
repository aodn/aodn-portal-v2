from datetime import date
from typing import List

from playwright.sync_api import Locator, Page, expect

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
        self.start_date_slider = self.searchbar_popup.get_by_role(
            'slider'
        ).first
        self.imos_histogram_bars = self.searchbar_popup.locator(
            '.MuiBarElement-series-imos-data-id:visible'
        )
        self.filter_parameters_tab = self.get_tab('Parameters')
        self.filter_platform_tab = self.get_tab('Platform')
        self.filter_organisation_tab = self.get_tab('Organisation')
        self.filter_data_tab = self.get_tab('Data')
        self.clear_all_button = page.get_by_test_id('clear-all-filters')

    def fill_search_text(self, search_text: str) -> None:
        """Fill up search text"""
        self.search_field.fill(search_text)

    def select_start_date(self, chosen_date: date) -> None:
        """Choose a start date through the desktop or mobile calendar."""
        field = self.start_date_picker.get_by_role('textbox')
        if field.get_attribute('readonly') is not None:
            field.click()
        else:
            self.start_date_picker.get_by_role('button').click()

        dialog = self.page.get_by_role('dialog')
        expect(dialog).to_be_visible()
        switch_to_year = dialog.get_by_role(
            'button',
            name='calendar view is open, switch to year view',
            exact=True,
        )
        switch_to_year.click()
        # Desktop picker is a Popper (CSS transform). Playwright will not
        # scroll a year that sits above the focused year inside that popper.
        self._click_calendar_radio(dialog, str(chosen_date.year))
        self._click_calendar_radio(dialog, chosen_date.strftime('%B'))
        dialog.get_by_role(
            'gridcell', name=str(chosen_date.day), exact=True
        ).click()
        confirm = dialog.get_by_role('button', name='OK', exact=True)
        if confirm.is_visible():
            confirm.click()
        expect(dialog).not_to_be_visible()

    def _click_calendar_radio(self, dialog: Locator, name: str) -> None:
        """Click a year or month radio, scrolling the calendar list first."""
        radio = dialog.get_by_role('radio', name=name, exact=True)
        radio.evaluate(
            """el => {
                el.scrollIntoView({ block: 'center', inline: 'nearest' });
            }"""
        )
        radio.click()

    def click_search_button(self) -> None:
        """Click on the search button"""
        self.search_button.click()

    def search_for(self, query: str) -> None:
        """Fills search input and submits search"""
        self.fill_search_text(query)
        self.click_search_button()

    def get_selected_location_intersects(self) -> str:
        """Get the intersects value of the selected location"""
        return execute_common_js(
            self.page, 'getSelectedLocationIntersects', 'selected-location'
        )

    def get_popup_button(self, name: str, exact: bool = True) -> Locator:
        """Return button element inside searchbar popup by text"""
        return self.searchbar_popup.get_by_role(
            'button', name=name, exact=exact
        )

    def get_temporal_during(self) -> str:
        """Get the temporal during value"""
        return execute_common_js(
            self.page, 'getTemporalDuring', 'temporal-during'
        )

    def assert_toggle_button_pressed(
        self, name: str, pressed: bool = True, exact: bool = True
    ) -> None:
        button = self.get_popup_button(name, exact=exact)
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

        Date is applied last. Switching away from the date popup unmounts
        DateRangeFilter, and a late map/URL sync can restore an empty
        dateTimeFilterRange over the radio we just chose.
        """
        self.location_button.click()
        self.page.get_by_label(location).click()
        expect(self.page.get_by_label(location)).to_be_checked()

        self.filter_button.click()
        expect(self.searchbar_popup).to_be_visible()
        if isinstance(filter_parameter, str):
            self.get_popup_button(filter_parameter, exact=False).click()
            self.assert_toggle_button_pressed(filter_parameter, exact=False)
        else:
            for parameter in filter_parameter:
                self.get_popup_button(parameter, exact=False).click()
                self.assert_toggle_button_pressed(parameter, exact=False)

        self.filter_platform_tab.click()
        if isinstance(filter_platform, str):
            self.get_popup_button(filter_platform).click()
            self.assert_toggle_button_pressed(filter_platform)
        else:
            for platform in filter_platform:
                self.get_popup_button(platform).click()
                self.assert_toggle_button_pressed(platform)

        self.filter_organisation_tab.click()
        self.get_popup_button(filter_organisation).click()
        self.assert_toggle_button_pressed(filter_organisation)

        self.filter_data_tab.click()
        self.get_popup_button(filter_data).click()
        self.assert_toggle_button_pressed(filter_data)
        if filter_data_download != '':
            self.get_popup_button(filter_data_download).click()
            self.assert_toggle_button_pressed(filter_data_download)

        self.date_button.click()
        self.get_radio_input(date).click()
        expect(self.get_radio_input(date)).to_be_checked()

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
        expect(self.page.get_by_label(location)).to_be_checked()

        self.filter_button.click()
        self.assert_toggle_button_pressed(filter_parameter)
        self.filter_platform_tab.click()
        self.assert_toggle_button_pressed(filter_platform)
        self.filter_organisation_tab.click()
        self.assert_toggle_button_pressed(filter_organisation)
        self.filter_data_tab.click()
        self.assert_toggle_button_pressed(filter_data)
        self.filter_button.click()  # close the popup

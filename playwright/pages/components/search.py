from playwright.sync_api import Page, expect

from pages.base_page import BasePage


class SearchComponent(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.search_field = page.get_by_test_id('input-with-suggester')
        self.search_button = page.get_by_test_id('search-button')
        self.date_button = page.get_by_test_id('date-range-button')
        self.location_button = page.get_by_test_id('location-button')
        self.filter_button = page.get_by_test_id('filtersBtn')
        self.searchbar_popup = page.get_by_test_id('searchbar-popup')
        self.filter_parameters_tab = self.get_tab('Parameters')
        self.filter_platform_tab = self.get_tab('Platform')
        self.filter_organisation_tab = self.get_tab('Organisation')
        self.filter_data_tab = self.get_tab('Data')

    def fill_search_text(self, search_text: str) -> None:
        """Fill up search text"""
        self.search_field.fill(search_text)

    def click_search_button(self) -> None:
        """Click on the search button"""
        self.search_button.click()

    def assert_toggle_button_pressed(
        self, name: str, pressed: bool = True
    ) -> None:
        button = self.get_button(name)
        expected_value = 'true' if pressed else 'false'
        expect(button).to_have_attribute('aria-pressed', expected_value)

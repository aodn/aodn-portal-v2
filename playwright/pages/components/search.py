from playwright.sync_api import Page

from pages.base_page import BasePage


class SearchComponent(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.search_field = page.get_by_test_id('input-with-suggester')
        self.search_button = self.get_button(text='Search')

    def fill_search_text(self, search_text: str) -> None:
        """Fill up search text"""
        self.search_field.fill(search_text)

    def click_search_button(self) -> None:
        """Click on the search button"""
        self.search_button.click()

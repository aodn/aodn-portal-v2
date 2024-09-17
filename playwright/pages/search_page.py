from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.components.map import Map
from pages.components.search import SearchComponent


class SearchPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.search = SearchComponent(page)
        self.map = Map(page)

        # Page locators
        self.loading = page.get_by_test_id(
            'search-page-result-list'
        ).get_by_test_id('loading-progress')
        self.first_result_title = page.get_by_test_id('result-card-title').first

    def wait_for_search_to_complete(self) -> None:
        """Wait until the search loading indicator disappears"""
        self.loading.wait_for(state='hidden', timeout=5000)

    def wait_for_updated_search_result(self) -> None:
        """Wait until the second search result is detached"""
        selector = 'div[data-testid="result-card-list"]'
        first_result = self.page.locator(selector).all()[1]
        first_result.wait_for(state='detached', timeout=5000)

    def click_dataset(self, title: str) -> None:
        """Click on the given dataset title"""
        self.page.locator('button').filter(has_text=title).click()

from playwright.sync_api import Page, TimeoutError

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
        """
        Waits for the search loading indicator to disappear, handling the case
        where it may appear twice. This function waits for the indicator to
        become hidden, and if it reappears, it waits again until it disappears.
        """
        self.loading.wait_for(state='hidden', timeout=20 * 1000)

        # Handle the case when loading indicator appears twice
        try:
            self.loading.wait_for(state='visible', timeout=1000)
            self.loading.wait_for(state='hidden', timeout=20 * 1000)
        except TimeoutError:
            # If the loading indicator doesn't reappear within the timeout,
            # assume the search is complete and ignore the exception.
            pass

    def wait_for_updated_search_result(self) -> None:
        """Wait until the second search result is detached"""
        selector = 'div[data-testid="result-card-list"]'
        first_result = self.page.locator(selector).all()[1]
        first_result.wait_for(state='detached', timeout=5000)

    def click_dataset(self, title: str) -> None:
        """Click on the given dataset title"""
        self.page.locator('button').filter(has_text=title).click()

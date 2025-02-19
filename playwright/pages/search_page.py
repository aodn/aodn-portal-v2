from playwright.sync_api import Locator, Page, TimeoutError

from mocks.api.collections import (
    handle_collections_show_more_api,
)
from mocks.api_router import ApiRouter
from pages.base_page import BasePage
from pages.components.map import Map
from pages.components.search import SearchComponent


class SearchPage(BasePage):
    MAP_ID = 'result-page-main-map'

    def __init__(self, page: Page):
        super().__init__(page)
        self.page = page
        self.search = SearchComponent(page)
        self.map = Map(page, self.MAP_ID)

        # -- Page locators --

        self.main_map = self.get_by_id('result-page-main-map')
        self.bookmark_list = page.get_by_test_id('bookmark-list-head')

        # results view
        self.show_result_count = page.get_by_test_id('show-result-count')
        self.result_list = page.get_by_test_id('search-page-result-list')
        self.result_card_list = page.get_by_test_id('result-card-list')
        self.result_grid = page.get_by_test_id('resultcard-result-grid')
        self.result_card_grid = page.get_by_test_id('result-card-grid')
        self.result_title = page.get_by_test_id('result-card-title')
        self.first_result_title = self.result_title.first
        self.loading = self.result_list.get_by_test_id('loading-progress')

        # buttons
        self.result_sort_button = page.get_by_test_id('result-sort-button')
        self.result_layout_button = page.get_by_test_id('result-layout-button')
        self.map_toggle_control_button = page.locator(
            '#map-toggle-control-button'
        )
        self.show_more_results = self.get_by_id(
            'result-card-load-more-btn'
        ).last

    def wait_for_search_to_complete(self) -> None:
        """
        Waits for the search loading indicator to disappear, handling the case
        where it may appear twice. This function waits for the indicator to
        become hidden, and if it reappears, it waits again until it disappears.
        """
        try:
            self.loading.wait_for(state='visible', timeout=2000)
        except TimeoutError:
            # If the loading indicator doesn't appear within the timeout,
            # assume the search is complete and ignore the exception.
            pass

        self.loading.wait_for(state='hidden', timeout=30 * 1000)

        # Handle the case when loading indicator appears twice
        try:
            self.loading.wait_for(state='visible', timeout=1000)
            self.loading.wait_for(state='hidden', timeout=30 * 1000)
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
        self.result_title.filter(has_text=title).first.click()

    def scroll_down_in_result_list(self, delta_y: int) -> None:
        """Scroll to the bottom of the result list"""
        self.result_list.hover()
        self.page.mouse.wheel(0, delta_y)

    def click_show_more_results(self) -> None:
        """Update api route and then click "Show more results" button"""
        api_router = ApiRouter(page=self.page)
        api_router.route_collection_all(handle_collections_show_more_api)

        self.show_more_results.click()

    def get_dataset_by_id(self, id: str) -> Locator:
        """Returns result card element by dataset id"""
        return self.get_by_id(f'result-card-{id}')

    def get_show_result_count_text(self, count: int, total: int) -> str:
        """Returns result count text in the specific format"""
        return f'Showing 1 - {count} of {total} results'

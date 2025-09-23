from playwright.sync_api import Locator, Page

from core.dataclasses.search_filter import SearchFilterConfig
from core.factories.search_filter_validator_factory import (
    SearchFilterValidatorFactory,
)
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
        self.grid_result_title = page.get_by_test_id('grid-card-title')
        self.loading = self.result_list.get_by_test_id('loading-progress')

        # buttons
        self.result_sort_button = self.get_by_id('result-sort-button')
        self.result_view_button = self.get_by_id('result-layout-button')
        self.list_and_map_view_button = page.get_by_test_id('menuitem-LIST')
        self.grid_and_map_view_button = page.get_by_test_id('menuitem-GRID')
        self.full_map_view_button = page.get_by_test_id('menuitem-FULL_MAP')
        self.full_list_view_button = page.get_by_test_id('menuitem-FULL_LIST')
        self.map_toggle_button = self.get_by_id('map-toggle-control-button')
        self.show_more_results = self.get_by_id(
            'result-card-load-more-btn'
        ).last

    def wait_for_search_to_complete(self) -> None:
        """
        Waits for the search results to finish loading.
        Since the data is mocked, loading is typically very fast.
        This method simply adds a short delay to ensure UI stability.
        """
        self.page.wait_for_timeout(100)

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

    def get_result_sort_button(self, text: str) -> Locator:
        """Returns result sort button element by text"""
        return self.page.get_by_test_id(f'result-sort-button-{text}')

    def get_result_view_button(self, text: str) -> Locator:
        """Returns result view button element by text"""
        return self.page.get_by_test_id(f'result-layout-button-{text}')

    def validate_search_parameters_in_url(
        self, url: str, expected_filters: SearchFilterConfig
    ) -> None:
        """
        Validate that the search parameters are correctly reflected in the URL

        Args:
            expected_filters: SearchFilterConfig containing expected parameter values

        Returns:
            Dictionary with parameter names as keys and validation results as values
        """
        validation_results = SearchFilterValidatorFactory.validate(
            url, expected_filters
        )
        for param_name, is_valid in validation_results.items():
            assert is_valid, f"Parameter '{param_name}' is not correctly reflected in Request URL: {url}"

    def wait_for_page_stabilization(self) -> None:
        """
        Waits for the search page to stabilize by monitoring the URL update.
        """
        self.wait_for_url_update()

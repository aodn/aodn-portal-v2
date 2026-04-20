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
    BOOKMARKED_ARIA_LABEL = 'Remove bookmark'

    def __init__(self, page: Page):
        super().__init__(page)
        self.page = page
        self.search = SearchComponent(page)
        self.map = Map(page, self.MAP_ID)

        # -- Page locators --

        self.main_map = self.get_by_id('result-page-main-map')
        self.bookmark_list = self.get_by_id('bookmark-list')
        self.bookmark_list_head = page.get_by_test_id('bookmark-list-head')

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
        self.list_and_map_view_button = page.get_by_test_id('menuitem-LIST')
        self.grid_and_map_view_button = page.get_by_test_id('menuitem-GRID')
        self.full_map_view_button = page.get_by_test_id('menuitem-FULL_MAP')
        self.full_list_view_button = page.get_by_test_id('menuitem-FULL_LIST')
        self.map_toggle_button = self.get_by_id('map-toggle-control-button')
        self.show_more_results = self.get_by_id(
            'result-card-load-more-btn'
        ).last
        self.result_card_download_button = page.get_by_test_id(
            'result-card-button-Download'
        )

    def wait_for_search_to_complete(self) -> None:
        """
        Waits for the search results to finish loading.
        """
        self.page.wait_for_load_state('load')

    def click_dataset(self, title: str) -> None:
        """Click on the given dataset title"""
        self.result_title.filter(has_text=title).first.click()

    def scroll_down_in_result_list(self, delta_y: int) -> None:
        """Scroll to the bottom of the result list"""
        self.result_list.hover()
        self.page.mouse.wheel(0, delta_y)

    def click_result_view_button(self) -> None:
        # Cannot use click directly because there is a auto-scroll feature
        # and in case with sticky header, it cause the screen to keep scoll and 
        # break the test
        self.get_by_id('result-layout-button').dispatch_event("mousedown")

    def click_result_sort_button(self) -> None:
        # Cannot use click directly because there is a auto-scroll feature
        # and in case with sticky header, it cause the screen to keep scoll and 
        # break the test
        self.get_by_id('result-sort-button').dispatch_event("mousedown")

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
            :param expected_filters:
            :param url:
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
        self.wait_for_timeout(1000)

    def get_bookmark_icon(self, dataset_id: str, parent: Locator) -> Locator:
        """Returns the bookmark icon element for a given dataset within the specified parent element."""
        return parent.get_by_test_id(f'{dataset_id}-iconbutton')

    def is_bookmarked(self, dataset_id: str, parent: Locator) -> bool:
        """
        Returns the bookmark state of a dataset by checking the presence of the bookmark icon in the given parent element.

        Args:
            dataset_id: The ID of the dataset to check
            parent: The parent element to search within
        """
        bookmark_icon = self.get_bookmark_icon(dataset_id, parent)
        bookmark_icon.wait_for(state='visible')  # ensure element is stable
        aria_label = bookmark_icon.get_attribute('aria-label')
        return aria_label == self.BOOKMARKED_ARIA_LABEL

    def assert_bookmark_state(self, data_id: str, expected: bool) -> None:
        assert self.is_bookmarked(data_id, self.result_card_list) is expected
        assert self.is_bookmarked(data_id, self.bookmark_list) is expected

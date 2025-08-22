from urllib.parse import unquote_plus

import pytest
from playwright.sync_api import Locator, Page, TimeoutError

from config import settings
from mocks.routes import Routes
from pages.base_page import BasePage
from pages.components.contact_area import ContactAreaComponent
from pages.components.map import Map
from pages.components.tab_container import TabContainerComponent


class DetailPage(BasePage):
    DETAIL_MAP_ID = 'map-detail-container-id'
    SPATIAL_MAP_ID = 'map-spatial-extent-container-id'

    def __init__(self, page: Page):
        super().__init__(page)
        self.page = page
        self.tabs = TabContainerComponent(page)
        self.detail_map = Map(page, self.DETAIL_MAP_ID)
        self.spatial_map = Map(page, self.SPATIAL_MAP_ID)
        self.contact_area = ContactAreaComponent(page)

        # -- Page locators --

        self.page_title = self.get_label(text='collection title')
        self.return_button = self.page.get_by_test_id('return-button')

        # download condition boxes
        self.bbox_condition_box = self.page.get_by_test_id('bbox-condition-box')
        self.date_range_condition_box = self.page.get_by_test_id(
            'date-range-condition-box'
        )

    def load(self, uuid: str) -> None:
        """Load the detail page for the given uuid"""
        url = f'{settings.baseURL}/details/{uuid}'
        self.page.goto(url, wait_until='domcontentloaded')

    def return_and_get_api_request_url(self) -> str:
        """Return to the previous page and return the API URL used for the request."""
        try:
            with self.page.expect_request(
                Routes.COLLECTION_CENTROID
            ) as request_info:
                self.return_button.click()
                self.wait_for_timeout(500)
            request = request_info.value
            return unquote_plus(request.url)
        except TimeoutError:
            pytest.fail(
                'API URL not found within the timeout, search did not trigger successfully.'
            )

    def get_tab_section(self, title: str) -> Locator:
        """Returns tab section title element"""
        return self.page.get_by_test_id(f'detail-sub-section-{title}')

    def get_not_found_element(self, item: str) -> Locator:
        """Returns the given item not found element"""
        return self.get_text(f'{item} Not Found')

    def click_show_more(self, item_list: str) -> None:
        self.page.get_by_test_id(f'show-more-detail-btn-{item_list}').click()

    def click_show_less(self, item_list: str) -> None:
        self.page.get_by_test_id(f'show-less-detail-btn-{item_list}').click()

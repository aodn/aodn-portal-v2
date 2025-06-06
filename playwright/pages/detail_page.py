from playwright.sync_api import Locator, Page

from config import settings
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
        self.go_back_button = self.page.get_by_test_id('go-back-button')
        self.description = self.page.get_by_test_id('expandable-text-area')

        # download condition boxes
        self.bbox_condition_box = self.page.get_by_test_id('bbox-condition-box')
        self.date_range_condition_box = self.page.get_by_test_id(
            'date-range-condition-box'
        )

    def load(self, uuid: str) -> None:
        """Load the detail page for the given uuid"""
        url = f'{settings.baseURL}/details/{uuid}'
        self.page.goto(url, wait_until='domcontentloaded')

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

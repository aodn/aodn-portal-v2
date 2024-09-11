from playwright.sync_api import Locator, Page

from config import settings
from pages.base_page import BasePage
from pages.components.contact_area import ContactAreaComponent
from pages.components.tab_container import TabContainerComponent


class DetailPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.tabs = TabContainerComponent(page)
        self.contact_area = ContactAreaComponent(page)

        # Page locators
        self.page_title = self.get_label(text='collection title')

    def load(self, uuid: str) -> None:
        url = f'{settings.baseURL}/details?uuid={uuid}'
        self.page.goto(url, timeout=90 * 1000)

    def get_tab_section(self, title: str) -> Locator:
        return self.page.get_by_test_id(f'detail-sub-section-{title}')

    def get_not_found_element(self, item: str) -> Locator:
        return self.get_text(f'{item} Not Found')

    def get_collapse_list(self, item_list: str) -> Locator:
        return self.page.get_by_test_id(f'collapse-list-{item_list.lower()}')

    def click_show_more(self, item_list: str) -> None:
        self.click_button(f'Show More {item_list}')

    def click_show_less(self, item_list: str) -> None:
        self.click_button(f'Show Less {item_list}')

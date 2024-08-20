import re

from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class DetailPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.page_title = self.get_label(text='collection title')
        self.abstract_map = page.get_by_label('Abstract').get_by_label(
            'Map', exact=True
        )

    def get_tab_section(self, title: str) -> Locator:
        return self.page.locator('span').filter(
            has_text=re.compile(rf'^{title}$')
        )

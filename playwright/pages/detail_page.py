from playwright.sync_api import Page

from pages.base_page import BasePage


class DetailPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.page_title = self.get_label(text='collection title')
        self.abstract_map = page.get_by_label('Abstract').get_by_label(
            'Map', exact=True
        )

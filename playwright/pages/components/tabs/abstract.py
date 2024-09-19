from playwright.sync_api import Page

from pages.base_page import BasePage


class AbstractTab(BasePage):
    TAB_NAME = 'Abstract'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        self.map = page.get_by_label(self.TAB_NAME).get_by_label(
            'Map', exact=True
        )

from playwright.sync_api import Page

from pages.base_page import BasePage


class LineageTab(BasePage):
    TAB_NAME = 'Lineage'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)

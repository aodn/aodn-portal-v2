from playwright.sync_api import Page

from pages.base_page import BasePage


class MapTab(BasePage):
    TAB_NAME = 'Map'

    def __init__(self, page: Page):
        self.page = page

        # -- Page locators --
        self.tab = self.get_tab(self.TAB_NAME)

from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class DataAccessTab(BasePage):
    TAB_NAME = 'Data Access'
    DATA_ACCESS_OPTIONS = 'Data Access Options'

    def __init__(self, page: Page):
        self.page = page

        # -- Page locators --

        self.tab = self.get_tab(self.TAB_NAME)

        # sections
        self.data_access_options = self.get_button(self.DATA_ACCESS_OPTIONS)

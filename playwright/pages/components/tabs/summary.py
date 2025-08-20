from playwright.sync_api import Page

from pages.base_page import BasePage


class SummaryTab(BasePage):
    TAB_NAME = 'Summary'

    def __init__(self, page: Page):
        self.page = page

        # -- Page locators --
        self.tab = self.get_tab(self.TAB_NAME)

        # abstract
        self.description = self.page.get_by_test_id('expandable-text-area')
        self.show_all_button = page.get_by_role('button', name='Show All')
        self.show_less_button = page.get_by_role('button', name='Show Less')

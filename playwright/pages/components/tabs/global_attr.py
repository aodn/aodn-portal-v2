from playwright.sync_api import Page

from pages.base_page import BasePage


class GlobalAttrTab(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab('Global Attribute')

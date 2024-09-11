from playwright.sync_api import Page

from pages.base_page import BasePage


class AbstractTab(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab('Abstract')
        self.map = page.get_by_label('Abstract').get_by_label('Map', exact=True)

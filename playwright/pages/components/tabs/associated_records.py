from playwright.sync_api import Page

from pages.base_page import BasePage


class AssociatedRecordsTab(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab('Associated Records')
        # sections
        self.parent_record = self.get_button('Parent Record')
        self.sibling_records = self.get_button('Sibling Records')
        self.child_records = self.get_button('Child Records')

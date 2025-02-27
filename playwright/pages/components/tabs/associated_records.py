from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class AssociatedRecordsTab(BasePage):
    TAB_NAME = 'Related Resources'
    PARENT_RECORD = 'Parent Record'
    SIBLING_RECORDS = 'Associated Records'
    CHILD_RECORDS = 'Sub Records'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        # sections
        self.parent_record = self.get_button(self.PARENT_RECORD)
        self.sibling_records = self.get_button(self.SIBLING_RECORDS)
        self.child_records = self.get_button(self.CHILD_RECORDS)

    def get_parent_record_list(self) -> Locator:
        return self.get_collapse_list(self.PARENT_RECORD)

    def get_sibling_records_list(self) -> Locator:
        return self.get_collapse_list(self.SIBLING_RECORDS)

    def get_child_records_list(self) -> Locator:
        return self.get_collapse_list(self.CHILD_RECORDS)

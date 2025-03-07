from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class RelatedResourcesTab(BasePage):
    TAB_NAME = 'Related Resources'
    PARENT_RECORD = 'Parent Record'
    ASSOCIATED_RECORDS = 'Associated Records'
    SUB_RECORDS = 'Sub Records'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        # sections
        self.parent_record = self.get_button(self.PARENT_RECORD)
        self.associated_records = self.get_button(self.ASSOCIATED_RECORDS)
        self.sub_records = self.get_button(self.SUB_RECORDS)

    def get_parent_record_list(self) -> Locator:
        return self.get_collapse_list(self.PARENT_RECORD)

    def get_associated_records_list(self) -> Locator:
        return self.get_collapse_list(self.ASSOCIATED_RECORDS)

    def get_sub_records_list(self) -> Locator:
        return self.get_collapse_list(self.SUB_RECORDS)

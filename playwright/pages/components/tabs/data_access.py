from playwright.sync_api import Page

from pages.base_page import BasePage


class DataAccessTab(BasePage):
    TAB_NAME = 'Data Access'
    DATA = 'Data'
    DOCUMENT = 'Document'
    CODE_TUTORIALS = 'Code Tutorials'
    OTHER = 'Other'

    def __init__(self, page: Page):
        self.page = page

        # -- Page locators --
        self.tab = self.get_tab(self.TAB_NAME)
        # sections
        self.data = self.get_button(self.DATA)
        self.document = self.get_button(self.DOCUMENT)
        self.code_tutorials = self.get_button(self.CODE_TUTORIALS)
        self.other = self.get_button(self.OTHER)

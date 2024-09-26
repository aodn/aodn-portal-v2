from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class AboutTab(BasePage):
    TAB_NAME = 'About'
    CONTACTS = 'Contacts'
    CREDITS = 'Credits'
    KEYWORDS = 'Keywords'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        # sections
        self.contacts = self.get_button(self.CONTACTS)
        self.credits = self.get_button(self.CREDITS)
        self.keywords = self.get_button(self.KEYWORDS)

    def get_contacts_list(self) -> Locator:
        return self.get_collapse_list(self.CONTACTS)

    def get_credits_list(self) -> Locator:
        return self.get_collapse_list(self.CREDITS)

    def get_keywords_list(self) -> Locator:
        return self.get_collapse_list(self.KEYWORDS)

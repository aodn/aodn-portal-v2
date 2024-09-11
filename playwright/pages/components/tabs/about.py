from playwright.sync_api import Page

from pages.base_page import BasePage


class AboutTab(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab('About')
        # sections
        self.contacts = self.get_button('Contacts')
        self.credits = self.get_button('Credits')
        self.keywords = self.get_button('Keywords')

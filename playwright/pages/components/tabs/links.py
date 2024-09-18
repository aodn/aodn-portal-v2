from playwright.sync_api import Page

from pages.base_page import BasePage


class LinksTab(BasePage):
    TAB_NAME = 'Links'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        self.link_cards = page.get_by_test_id('links-card')
        self.copy_link_button = self.get_button('Copy Link')

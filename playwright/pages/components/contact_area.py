from playwright.sync_api import Page

from pages.base_page import BasePage


class ContactAreaComponent(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.address = page.get_by_test_id('contact-address')
        self.phone = page.get_by_test_id('contact-phone')
        self.link = page.get_by_test_id('contact-link')

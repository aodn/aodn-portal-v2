from playwright.sync_api import Page

from config import settings
from pages.base_page import BasePage
from pages.components.search import SearchComponent


class LandingPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.page = page
        self.search = SearchComponent(page)

        # -- Page locators --
        self.hero_text = page.get_by_test_id('hero-text')

    def load(self) -> None:
        self.page.goto(settings.baseURL, wait_until='load')

    def is_loaded(self) -> bool:
        """Return True if current page is the landing page"""
        return self.page.url.endswith('/') and self.hero_text.is_visible()

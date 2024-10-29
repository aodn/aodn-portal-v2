from playwright.sync_api import Page

from config import settings
from pages.base_page import BasePage
from pages.components.search import SearchComponent


class LandingPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.search = SearchComponent(page)

    def load(self) -> None:
        self.page.goto(settings.baseURL, wait_until='domcontentloaded')

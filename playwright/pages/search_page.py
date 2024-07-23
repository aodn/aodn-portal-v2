from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.components.search import SearchComponent


class SearchPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.search = SearchComponent(page)

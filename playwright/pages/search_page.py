from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.components.map import Map
from pages.components.search import SearchComponent


class SearchPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.search = SearchComponent(page)
        self.map = Map(page)

        # Page locators
        self.first_result_title = page.locator(
            'div[data-testid="result-card-list"] > button > div > div > p'
        ).first
        self.popup_title = page.locator('div.mapboxgl-popup-content p').first

    def wait_for_updated_search_result(self) -> None:
        selector = 'div[data-testid="result-card-list"]'
        first_result = self.page.locator(selector).all()[1]
        first_result.wait_for(state='detached', timeout=5000)

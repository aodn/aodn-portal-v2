from playwright.sync_api import Locator, Page


class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def get_button(self, text: str) -> Locator:
        """Return button element by text"""
        return self.page.get_by_role('button', name=text, exact=True)

    def get_option(self, text: str) -> Locator:
        """Return option element by text"""
        return self.page.get_by_role('option', name=text, exact=True)

    def click_option(self, text: str) -> None:
        """Click on the given option"""
        self.get_option(text).click()

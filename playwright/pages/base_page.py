from playwright.sync_api import Locator, Page


class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def get_button(self, text: str, exact: bool = True) -> Locator:
        """Return button element by text"""
        return self.page.get_by_role('button', name=text, exact=exact)

    def click_button(self, text: str) -> None:
        """Click on the given button"""
        self.get_button(text).click()

    def get_option(self, text: str, exact: bool = True) -> Locator:
        """Return option element by text"""
        return self.page.get_by_role('option', name=text, exact=exact)

    def click_option(self, text: str) -> None:
        """Click on the given option"""
        self.get_option(text).click()

    def get_label(self, text: str) -> Locator:
        """Return label element by text"""
        return self.page.get_by_label(text, exact=True)

    def click_label(self, text: str) -> None:
        """Click on the given label"""
        self.get_label(text).click()

    def get_text(self, text: str) -> Locator:
        """Return element by text"""
        return self.page.get_by_text(text)

    def click_text(self, text: str) -> None:
        """Click on the given text"""
        self.get_text(text).click()

    def get_tab(self, text: str) -> Locator:
        """Return tab element by text"""
        return self.page.get_by_role('tab', name=text, exact=True)

    def click_tab(self, text: str) -> None:
        """Click on the given tab"""
        self.get_tab(text).click()

    def get_heading(self, text: str) -> Locator:
        """Return heading element by text"""
        return self.page.get_by_role('heading', name=text, exact=True)

    def click_heading(self, text: str) -> None:
        """Click on the given heading"""
        self.get_heading(text).click()

    def get_collapse_list(self, item_list: str) -> Locator:
        return self.page.get_by_test_id(f'collapse-list-{item_list}')

    def get_collapse_list_items(self, item_list: str) -> Locator:
        return self.get_collapse_list(item_list).get_by_test_id('collapseItem')

from typing import Any

from playwright.sync_api import Locator, Page

from pages.js_scripts.js_utils import execute_js, load_common_js_functions


class BasePage:
    def __init__(self, page: Page):
        self.page = page
        load_common_js_functions(self.page)

        # Common locators
        self.body = page.locator('body')
        self.select_elements = page.get_by_test_id('common-select')

    def __getattr__(self, name: str) -> Any:
        # Delegate attribute lookup to the page object if not found in custom 'Page' classes
        return getattr(self.page, name)

    def get_by_id(self, id: str) -> Locator:
        """Return a locator by id attribute"""
        return self.page.locator(f'#{id}')

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

    def get_text(self, text: str, exact: bool = False) -> Locator:
        """Return element by text"""
        return self.page.get_by_text(text, exact=exact)

    def click_text(self, text: str, exact: bool = False) -> None:
        """Click on the given text"""
        self.get_text(text, exact=exact).click()

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
        """Returns collapse list container element"""
        return self.page.get_by_test_id(f'collapse-list-{item_list}')

    def get_collapse_list_items(self, item_list: str) -> Locator:
        """Returns the given collapse list items"""
        return self.get_collapse_list(item_list).get_by_test_id('collapseItem')

    def get_collapse_item_title(self, title: str) -> Locator:
        """Returns the given collapse item title"""
        return self.page.get_by_test_id(f'collapse-item-{title}')

    def scroll_to_bottom(self) -> None:
        """Scroll to the bottom of the page"""
        execute_js(self.page, 'scrollToBottom')

    def get_page_scroll_y(self) -> int:
        """Get the current page scroll Y position"""
        return execute_js(self.page, 'getPageScrollY')

from typing import Any, Callable, Tuple
from urllib.parse import unquote_plus

import pytest
from playwright.sync_api import Locator, Page, TimeoutError

from mocks.routes import Routes
from pages.js_scripts.js_utils import (
    execute_common_js,
    load_common_js_functions,
)


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

    def go_to_landing_page(self) -> None:
        """Navigate to the landing page"""
        self.page.get_by_test_id('aodn-home-link').first.click()

    def get_current_url(self) -> str:
        """Get the current page URL"""
        return self.page.url

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

    def get_radio_input(self, text: str) -> Locator:
        """Return the radio input element based on the visible label text"""
        return self.page.locator(
            f'[data-testid="radio-{text}"] input[type="radio"]'
        )

    def get_collapse_list(self, item_list: str) -> Locator:
        """Returns collapse list container element"""
        return self.page.get_by_test_id(f'collapse-list-{item_list}')

    def get_collapse_list_items(self, item_list: str) -> Locator:
        """Returns the given collapse list items"""
        return self.get_collapse_list(item_list).get_by_test_id('collapseItem')

    def get_collapse_item_title(self, title: str) -> Locator:
        """Returns the given collapse item title"""
        return self.page.get_by_test_id(f'collapse-item-{title}')

    def get_collapse_item_button(self, title: str) -> Locator:
        """Returns the given collapse item button"""
        return self.page.get_by_test_id(f'collapse-btn-{title}')

    def scroll_to_bottom(self) -> None:
        """Scroll to the bottom of the page"""
        execute_common_js(self.page, 'scrollToBottom')

    def get_page_scroll_y(self) -> int:
        """Get the current page scroll Y position"""
        return execute_common_js(self.page, 'getPageScrollY')

    def get_element_height(self, locator: Locator) -> int:
        """Get the height of the given element"""
        bounding_box = locator.bounding_box()
        if bounding_box is not None:
            return int(bounding_box['height'])
        else:
            raise ValueError('Element is not visible')

    def wait_for_url_update(self, timeout: int = 5000) -> None:
        """
        Wait for the current page URL to update.

        Args:
            timeout: Maximum time to wait in milliseconds (default: 5000ms)
        """
        initial_url = self.page.url
        try:
            self.page.wait_for_function(
                f"() => window.location.href !== '{initial_url}'",
                timeout=timeout,
            )
        except TimeoutError:
            # URL update was too quick or didn't happen.
            pass

    def perform_action_and_get_api_url(
        self, action: Callable[[], None]
    ) -> Tuple[str, str]:
        """
        Perform an action (e.g., click search, zoom/drag map) and return the API URLs
        used for the request.

        Args:
            action: A callable function that performs the desired action

        Returns:
            Tuple containing the collections URL and centroid URL
        """
        try:
            with (
                self.page.expect_request(
                    Routes.COLLECTION_ALL
                ) as collections_request_info,
                self.page.expect_request(
                    Routes.COLLECTION_CENTROID
                ) as centroid_request_info,
            ):
                action()  # Execute the passed function
                self.wait_for_url_update()

            collections_request = collections_request_info.value
            centroid_request = centroid_request_info.value

            return (
                unquote_plus(collections_request.url),
                unquote_plus(centroid_request.url),
            )
        except TimeoutError:
            pytest.fail(
                'API URL not found within the timeout, search did not trigger successfully.'
            )

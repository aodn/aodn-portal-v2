import pytest
from playwright.sync_api import Page

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_show_all_and_less_description(
    responsive_page: Page, uuid: str
) -> None:
    """
    Verifies that the 'Show All' and 'Show Less' buttons on the detail page
    'Summary' tab correctly expand and collapse the description text.

    The test loads a dataset using its UUID, captures the initial height of
    the description element, clicks 'Show All' to confirm the description
    expands to a longer height, and then clicks 'Show Less' to ensure
    the description returns to its original height, validating the
    UI's description toggle functionality works correctly.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    summary = detail_page.tabs.summary

    initial_height = detail_page.get_element_height(summary.description)
    summary.show_all_button.click()
    assert detail_page.get_element_height(summary.description) > initial_height
    summary.show_less_button.click()
    assert detail_page.get_element_height(summary.description) == initial_height

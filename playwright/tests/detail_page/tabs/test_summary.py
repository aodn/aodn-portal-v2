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

    On desktop the description starts collapsed (toggle Show All -> Show Less).
    On mobile the description starts expanded by design (toggle Show Less ->
    Show All). Either way, expanding produces a taller element than the
    collapsed state.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    summary = detail_page.tabs.summary

    if detail_page.is_mobile_viewport():
        # Mobile starts expanded: collapse first, then re-expand.
        expanded_height = detail_page.get_element_height(
            summary.description.first
        )

        summary.show_less_button.click()
        collapsed_height = detail_page.get_element_height(
            summary.description.first
        )
        assert collapsed_height < expanded_height

        summary.show_all_button.click()
        assert (
            detail_page.get_element_height(summary.description.first)
            == expanded_height
        )
    else:
        initial_height = detail_page.get_element_height(
            summary.description.first
        )

        summary.show_all_button.click()
        assert (
            detail_page.get_element_height(summary.description.first)
            > initial_height
        )

        summary.show_less_button.click()
        assert (
            detail_page.get_element_height(summary.description.first)
            == initial_height
        )

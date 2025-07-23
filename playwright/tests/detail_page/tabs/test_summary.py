from typing import Optional

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

    The test loads a dataset using its UUID, captures the initial length of
    the description text, clicks 'Show All' to confirm the description
    expands to a longer length, and then clicks 'Show Less' to ensure
    the description returns to its original length, validating the
    UI's description toggle functionality works correctly.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    description = detail_page.description

    def get_description_length(text: Optional[str]) -> int:
        return len(text) if text is not None else 0

    initial_length = get_description_length(description.text_content())
    detail_page.get_by_role('button', name='Show All').click()
    assert get_description_length(description.text_content()) > initial_length
    detail_page.get_by_role('button', name='Show Less').click()
    assert get_description_length(description.text_content()) == initial_length

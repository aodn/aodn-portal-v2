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
def test_show_all_and_less_description(page_mock: Page, uuid: str) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    description = page_mock.get_by_test_id('expandable-text-area')

    def get_description_length(text: Optional[str]) -> int:
        return len(text) if text is not None else 0

    initial_length = get_description_length(description.text_content())
    page_mock.get_by_role('button', name='Show All').click()
    assert get_description_length(description.text_content()) > initial_length
    page_mock.get_by_role('button', name='Show Less').click()
    assert get_description_length(description.text_content()) == initial_length

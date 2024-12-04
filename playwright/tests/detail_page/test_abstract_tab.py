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
    # page_mock.pause()
    description = page_mock.get_by_test_id('expandable-text-area')

    initial_length = len(description.text_content())
    page_mock.get_by_role('button', name='Show All').click()
    assert len(description.text_content()) > initial_length
    page_mock.get_by_role('button', name='Show Less').click()
    assert len(description.text_content()) == initial_length

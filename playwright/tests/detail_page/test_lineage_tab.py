import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, content',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'Vessels collect 38 kHz acoustic data from either Simrad EK60',
        ),
    ],
)
def test_lineage_sections(
    responsive_page: Page,
    title: str,
    uuid: str,
    content: str,
) -> None:
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    lineage = detail_page.tabs.lineage
    lineage.tab.click()

    expect(detail_page.get_text(content)).to_be_visible()

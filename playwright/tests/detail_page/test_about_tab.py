import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, contact, credit, keyword, keyword_value',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Integrated Marine Observing System (IMOS)',
            'Integrated Marine Observing System (IMOS) is enabled by the National Collaborative Research Infrastructure Strategy',
            'IMOS Keywords Thesaurus',
            'IMOS Facility | Deep Water Moorings',
        ),
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'CSIRO Oceans & Atmosphere - Hobart - Downie, Ryan',
            'Credits Not Found',
            'AODN Geographic Extent Names',
            'Global / Oceans | Indian',
        ),
    ],
)
def test_about_sections(
    page_mock: Page,
    title: str,
    uuid: str,
    contact: str,
    credit: str,
    keyword: str,
    keyword_value: str,
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    about = detail_page.tabs.about
    about.tab.click()

    about.keywords.click()
    detail_page.click_button(keyword)
    expect(detail_page.get_text(keyword_value)).to_be_in_viewport()

    about.credits.click()
    expect(detail_page.get_text(credit)).to_be_in_viewport()

    about.contacts.click()
    expect(detail_page.get_button(contact)).to_be_in_viewport()

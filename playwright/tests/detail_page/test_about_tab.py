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
        )
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
    detail_page.get_collapse_item_title(keyword).click()
    keywords_list = about.get_keywords_list()
    expect(keywords_list.get_by_text(keyword_value)).to_be_in_viewport()

    about.credits.click()
    credits_list = about.get_credits_list()
    expect(credits_list.get_by_text(credit)).to_be_in_viewport()

    about.contacts.click()
    expect(detail_page.get_collapse_item_title(contact)).to_be_in_viewport()

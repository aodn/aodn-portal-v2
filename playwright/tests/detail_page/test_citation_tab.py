import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, constranits_value, suggested_citation_value, license_value',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Use Limitation',
            'The citation in a list of references is: "IMOS [year-of-data-download]',
            'Creative Commons Attribution 4.0 International License',
        ),
    ],
)
def test_citation_sections(
    page_mock: Page,
    title: str,
    uuid: str,
    constranits_value: str,
    suggested_citation_value: str,
    license_value: str,
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.tabs.scroll_right()
    citation = detail_page.tabs.citation
    citation.tab.click()

    citation.constranits.click()
    expect(detail_page.get_text(constranits_value)).to_be_in_viewport()

    citation.suggested_citation.click()
    expect(detail_page.get_text(suggested_citation_value)).to_be_in_viewport()

    citation.license.click()
    expect(detail_page.get_text(license_value)).to_be_in_viewport()

import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, suggested_citation, cited_responsible_parties, license, constraints, data_contact, credits',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'The citation in a list of references is: "IMOS [year-of-data-download]',
            'Department of Environment, Land, Water and Planning (DELWP), Victorian Government - Mazor, Tessa',
            'Creative Commons Attribution 4.0 International License',
            'Use Limitation',
            'Institute for Marine and Antarctic Studies (IMAS), University of Tasmania (UTAS) - Edgar, Graham',
            'Australia’s Integrated Marine Observing System (IMOS) is enabled by',
        ),
    ],
)
def test_citation_and_usage_sections(
    responsive_page: Page,
    title: str,
    uuid: str,
    suggested_citation: str,
    cited_responsible_parties: str,
    license: str,
    constraints: str,
    data_contact: str,
    credits: str,
) -> None:
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.tabs.scroll_right()
    citation = detail_page.tabs.citation_and_usage
    citation.tab.click()

    citation.credits.click()
    credits_list = citation.get_credits_list()
    expect(credits_list.get_by_text(credits)).to_be_visible()

    citation.data_contact.click()
    data_contact_list = citation.get_data_contact_list()
    expect(data_contact_list.get_by_text(data_contact)).to_be_visible()

    citation.constraints.click()
    constraints_list = citation.get_constraints_list()
    expect(constraints_list.get_by_text(constraints)).to_be_visible()

    citation.license.click()
    license_list = citation.get_license_list()
    expect(license_list.get_by_text(license)).to_be_visible()

    citation.cited_responsible_parties.click()
    cited_responsible_parties_list = (
        citation.get_cited_responsible_parties_list()
    )
    expect(
        cited_responsible_parties_list.get_by_text(cited_responsible_parties)
    ).to_be_visible()

    citation.suggested_citation.click()
    suggested_citation_list = citation.get_suggested_citation_list()
    expect(
        suggested_citation_list.get_by_text(suggested_citation)
    ).to_be_visible()

import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage

@pytest.mark.skip("Section moved tab")
@pytest.mark.parametrize(
    'title, uuid, metadata_contact, metadata_identifier, full_metadata_link, metadata_dates',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Integrated Marine Observing System (IMOS)',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'https://metadata.imas.utas.edu.au/geonetwork/srv/eng/catalog.search',
            'CREATION: Thu Jul 09 2020 15:40:31 GMT+0000',
        ),
    ],
)
def test_metadata_info_sections(
    responsive_page: Page,
    title: str,
    uuid: str,
    metadata_contact: str,
    metadata_identifier: str,
    full_metadata_link: str,
    metadata_dates: str,
) -> None:
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    metadata_info = detail_page.tabs.metadata_info
    metadata_info.tab.click()

    metadata_info.metadata_dates.click()
    metadata_dates_list = metadata_info.get_metadata_dates_list()
    expect(metadata_dates_list.get_by_text(metadata_dates)).to_be_visible()

    metadata_info.full_metadata_link.click()
    full_metadata_link_list = metadata_info.get_full_metadata_link_list()
    expect(
        full_metadata_link_list.get_by_role('link', name=full_metadata_link)
    ).to_be_visible()

    metadata_info.metadata_identifier.click()
    metadata_identifier_list = metadata_info.get_metadata_identifier_list()
    expect(
        metadata_identifier_list.get_by_text(metadata_identifier)
    ).to_be_visible()

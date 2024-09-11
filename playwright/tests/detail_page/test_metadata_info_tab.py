import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, metadata_contact, metadata_identifier, metadata_dates',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Integrated Marine Observing System (IMOS)',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'CREATION: Thu Jul 09 2020 15:40:31 GMT+0000',
        ),
    ],
)
def test_metadata_info_sections(
    page_mock: Page,
    title: str,
    uuid: str,
    metadata_contact: str,
    metadata_identifier: str,
    metadata_dates: str,
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    metadata_info = detail_page.tabs.metadata_info
    metadata_info.tab.click()

    metadata_info.metadata_dates.click()
    expect(detail_page.get_text(metadata_dates)).to_be_in_viewport()

    metadata_info.metadata_identifier.click()
    expect(detail_page.get_text(metadata_identifier)).to_be_in_viewport()

    metadata_info.metadata_contact.click()
    expect(metadata_info.meradata_contact_title).to_be_in_viewport()
    expect(metadata_info.meradata_contact_title).to_have_text(metadata_contact)

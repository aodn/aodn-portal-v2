import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, parent_record, parent_record_value, sibling_records, sibling_records_value',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Integrated Marine Observing System (IMOS)',
            'IMOS is designed to be a fully-integrated, national system',
            'IMOS - New Technology Proving - Low Cost Wave Buoys',
            'The Low Cost Wave Buoy Technology Sub-Facility',
        ),
    ],
)
def test_associated_records_sections(
    page_mock: Page,
    title: str,
    uuid: str,
    parent_record: str,
    parent_record_value: str,
    sibling_records: str,
    sibling_records_value: str,
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.tabs.scroll_right()
    associated_records = detail_page.tabs.associated_records
    associated_records.tab.click()

    associated_records.sibling_records.click()
    detail_page.click_button(sibling_records)
    expect(detail_page.get_text(sibling_records_value)).to_be_in_viewport()

    associated_records.parent_record.click()
    detail_page.click_button(parent_record)
    expect(detail_page.get_text(parent_record_value)).to_be_in_viewport()

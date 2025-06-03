import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, parent_record, parent_record_value, associated_records, associated_records_value, sub_records, sub_records_value',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Integrated Marine Observing System (IMOS)',
            'IMOS is designed to be a fully-integrated, national system, observing at ocean-basin',
            'IMOS - New Technology Proving - Low Cost Wave Buoys',
            'The Low Cost Wave Buoy Technology Sub-Facility',
            'IMOS - Australian National Mooring Network (ANMN) Facility',
            'The Australian National Mooring Network Facility is a series of national reference stations',
        ),
    ],
)
def test_related_resources_sections(
    responsive_page: Page,
    title: str,
    uuid: str,
    parent_record: str,
    parent_record_value: str,
    associated_records: str,
    associated_records_value: str,
    sub_records: str,
    sub_records_value: str,
) -> None:
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.tabs.scroll_right()
    related_resources = detail_page.tabs.related_resources
    related_resources.tab.click()

    related_resources.sub_records.click()
    detail_page.get_collapse_item_title(sub_records).click()
    sub_records_list = related_resources.get_sub_records_list()
    expect(sub_records_list.get_by_text(sub_records_value)).to_be_visible()

    related_resources.associated_records.click()
    detail_page.get_collapse_item_title(associated_records).click()
    associated_records_list = related_resources.get_associated_records_list()
    expect(
        associated_records_list.get_by_text(associated_records_value)
    ).to_be_visible()

    related_resources.parent_record.click()
    detail_page.get_collapse_item_title(parent_record).click()
    parent_record_list = related_resources.get_parent_record_list()
    expect(parent_record_list.get_by_text(parent_record_value)).to_be_visible()

import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, lineage_value, keyword, keyword_value, metadata_contact, metadata_identifier, full_metadata_link, metadata_dates',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Vessels collect 38 kHz acoustic data from either Simrad EK60',
            'IMOS Keywords Thesaurus',
            'IMOS Facility | Deep Water Moorings',
            'Integrated Marine Observing System (IMOS)',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'https://metadata.imas.utas.edu.au/geonetwork/srv/eng/catalog.search',
            'CREATION: Thu Jul 09 2020 15:40:31 GMT+0000',
        ),
    ],
)
def test_additional_information_sections_in_desktop(
    desktop_page: Page,
    title: str,
    uuid: str,
    lineage_value: str,
    keyword: str,
    keyword_value: str,
    metadata_contact: str,
    metadata_identifier: str,
    full_metadata_link: str,
    metadata_dates: str,
) -> None:
    """
    Verifies that the 'Additional Information' tab correctly scrolls to and
    displays the corresponding section's content when a section title
    is clicked from the tab's navigation panel.

    The test ensures that clicking each section title in the tab's navigation panel
    triggers the tab to scroll to the associated section area and accurately
    shows the relevant data for that section, confirming the UI's navigation
    and content display functionality works as intended.
    """
    detail_page = DetailPage(desktop_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    additional_info = detail_page.tabs.additional_info
    additional_info.tab.click()

    additional_info.metadata_dates.click()
    metadata_dates_list = additional_info.get_metadata_dates_list()
    expect(metadata_dates_list.get_by_text(metadata_dates)).to_be_visible()

    additional_info.full_metadata_link.click()
    full_metadata_link_list = additional_info.get_full_metadata_link_list()
    expect(
        full_metadata_link_list.get_by_role('link', name=full_metadata_link)
    ).to_be_visible()

    additional_info.metadata_identifier.click()
    metadata_identifier_list = additional_info.get_metadata_identifier_list()
    expect(
        metadata_identifier_list.get_by_text(metadata_identifier)
    ).to_be_visible()

    additional_info.metadata_contact.click()
    expect(additional_info.metadata_contact_title).to_be_visible()
    expect(additional_info.metadata_contact_title).to_have_text(
        metadata_contact
    )

    additional_info.keywords.click()
    detail_page.get_collapse_item_title(keyword).click()
    keywords_list = additional_info.get_keywords_list()
    expect(keywords_list.get_by_text(keyword_value)).to_be_visible()

    additional_info.lineage.click()
    expect(detail_page.get_text(lineage_value)).to_be_visible()


@pytest.mark.parametrize(
    'title, uuid, lineage_value, keyword, keyword_value, metadata_contact, metadata_identifier, full_metadata_link, metadata_dates',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Vessels collect 38 kHz acoustic data from either Simrad EK60',
            'IMOS Keywords Thesaurus',
            'IMOS Facility | Deep Water Moorings',
            'Integrated Marine Observing System (IMOS)',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'https://metadata.imas.utas.edu.au/geonetwork/srv/eng/catalog.search',
            'CREATION: Thu Jul 09 2020 15:40:31 GMT+0000',
        ),
    ],
)
def test_additional_information_sections_in_mobile(
    mobile_page: Page,
    title: str,
    uuid: str,
    lineage_value: str,
    keyword: str,
    keyword_value: str,
    metadata_contact: str,
    metadata_identifier: str,
    full_metadata_link: str,
    metadata_dates: str,
) -> None:
    """
    Verifies that the 'Additional Information' tab correctly scrolls to and
    displays the corresponding section's content when a section title
    is clicked from the tab's navigation panel.

    The test ensures that clicking each section title in the tab's navigation panel
    triggers the tab to scroll to the associated section area and accurately
    shows the relevant data for that section, confirming the UI's navigation
    and content display functionality works as intended.
    """
    detail_page = DetailPage(mobile_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    additional_info = detail_page.tabs.additional_info
    additional_info.tab.click()

    metadata_dates_list = additional_info.get_metadata_dates_list()
    expect(metadata_dates_list.get_by_text(metadata_dates)).to_be_visible()

    full_metadata_link_list = additional_info.get_full_metadata_link_list()
    expect(
        full_metadata_link_list.get_by_role('link', name=full_metadata_link)
    ).to_be_visible()

    metadata_identifier_list = additional_info.get_metadata_identifier_list()
    expect(
        metadata_identifier_list.get_by_text(metadata_identifier)
    ).to_be_visible()

    expect(additional_info.metadata_contact_title).to_be_visible()
    expect(additional_info.metadata_contact_title).to_have_text(
        metadata_contact
    )

    detail_page.get_collapse_item_title(keyword).click()
    keywords_list = additional_info.get_keywords_list()
    expect(keywords_list.get_by_text(keyword_value)).to_be_visible()

    expect(detail_page.get_text(lineage_value)).to_be_visible()

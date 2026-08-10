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
    """
    Multiple string found, this is because different tab all in DOM just hidden
    """
    expect(additional_info.metadata_contact_title.first).to_have_css(
        'visibility', 'visible', timeout=5000
    )
    expect(additional_info.metadata_contact_title.first).to_have_text(
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

    """
    Multiple string found, this is because different tab all in DOM just hidden
    """
    expect(additional_info.metadata_contact_title.first).to_have_css(
        'visibility', 'visible', timeout=5000
    )
    expect(additional_info.metadata_contact_title.first).to_have_text(
        metadata_contact
    )

    detail_page.get_collapse_item_title(keyword).click()
    keywords_list = additional_info.get_keywords_list()
    expect(keywords_list.get_by_text(keyword_value)).to_be_visible()

    expect(detail_page.get_text(lineage_value)).to_be_visible()


@pytest.mark.parametrize(
    'uuid, chip',
    [
        (
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Distributor',
        ),
    ],
)
def test_collapse_item_chip_aligns_with_arrow_in_desktop(
    desktop_page: Page,
    uuid: str,
    chip: str,
) -> None:
    """
    Verifies the label chip sits right before the collapse arrow, keeping
    the same spacing as between the arrow and the row's right end.
    """
    detail_page = DetailPage(desktop_page)

    detail_page.load(uuid)
    additional_info = detail_page.tabs.additional_info
    additional_info.tab.click()

    chip_locator = (
        desktop_page.get_by_test_id(f'label-chip-{chip}')
        .locator('visible=true')
        .first
    )
    expect(chip_locator).to_be_visible()
    row = chip_locator.locator(
        'xpath=ancestor::*[@data-testid="collapseItem"]'
    )
    arrow = row.get_by_label('expand or collapse').locator('svg')

    chip_box = chip_locator.bounding_box()
    arrow_box = arrow.bounding_box()
    row_box = row.locator('xpath=..').bounding_box()

    gap_chip_to_arrow = arrow_box['x'] - (chip_box['x'] + chip_box['width'])
    gap_arrow_to_edge = (row_box['x'] + row_box['width']) - (
        arrow_box['x'] + arrow_box['width']
    )
    assert abs(gap_chip_to_arrow - gap_arrow_to_edge) <= 2

    # Chip and arrow sit on the same (first) title line
    chip_center_y = chip_box['y'] + chip_box['height'] / 2
    arrow_center_y = arrow_box['y'] + arrow_box['height'] / 2
    assert abs(chip_center_y - arrow_center_y) <= 6

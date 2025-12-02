import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, data_link_title, data_link_href, document_link_title, document_link_href, other_link_title, other_link_href',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'Data Link',
            'https://thredds.aodn.org.au/thredds/catalog/IMOS/SOOP/SOOP-BA/catalog.html',
            'Documentation Link',
            'https://imos.org.au/fileadmin/user_upload/shared/SOOP/plugin-SOOP-BA_NetCDF_manual_v1.1.pdf',
            'AODN record',
            '/metadata/8edf509b-1481-48fd-b9c5-b95b42247f82',
        ),
    ],
)
def test_links_sections_in_desktop(
    desktop_page: Page,
    title: str,
    uuid: str,
    data_link_title: str,
    data_link_href: str,
    document_link_title: str,
    document_link_href: str,
    other_link_title: str,
    other_link_href: str,
) -> None:
    """
    Verifies that the 'Data Access' tab correctly scrolls to and
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
    data_access = detail_page.tabs.data_access
    data_access.tab.click()

    data_access.other.click()
    link_card = detail_page.get_by_test_id(f'link-card-{other_link_href}')
    link = link_card.get_by_role('link', name=other_link_title)
    expect(link).to_be_visible()
    assert link.get_attribute('href') == other_link_href

    data_access.document.click()
    link_card = detail_page.get_by_test_id(f'link-card-{document_link_href}')
    link = link_card.get_by_role('link', name=document_link_title)
    expect(link).to_be_visible()
    assert link.get_attribute('href') == document_link_href

    data_access.data.click()
    link_card = detail_page.get_by_test_id(f'link-card-{data_link_href}').first
    link_card.hover()
    expect(
        detail_page.get_by_test_id(f'copy-button-{data_link_href}')
    ).to_be_visible()

    link = link_card.get_by_role('link', name=data_link_title).first
    expect(link).to_be_visible()
    assert link.get_attribute('href') == data_link_href


@pytest.mark.parametrize(
    'title, uuid, data_link_title, data_link_href, document_link_title, document_link_href, other_link_title, other_link_href',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'Data Link',
            'https://thredds.aodn.org.au/thredds/catalog/IMOS/SOOP/SOOP-BA/catalog.html',
            'Documentation Link',
            'https://imos.org.au/fileadmin/user_upload/shared/SOOP/plugin-SOOP-BA_NetCDF_manual_v1.1.pdf',
            'AODN record',
            '/metadata/8edf509b-1481-48fd-b9c5-b95b42247f82',
        ),
    ],
)
def test_links_sections_in_mobile(
    mobile_page: Page,
    title: str,
    uuid: str,
    data_link_title: str,
    data_link_href: str,
    document_link_title: str,
    document_link_href: str,
    other_link_title: str,
    other_link_href: str,
) -> None:
    """
    Verifies that the 'Data Access' tab correctly scrolls to and
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
    data_access = detail_page.tabs.data_access
    data_access.tab.click()

    link_card = detail_page.get_by_test_id(f'link-card-{other_link_href}')
    link = link_card.get_by_role('link', name=other_link_title)
    expect(link).to_be_visible()
    assert link.get_attribute('href') == other_link_href

    link_card = detail_page.get_by_test_id(f'link-card-{document_link_href}')
    link = link_card.get_by_role('link', name=document_link_title)
    expect(link).to_be_visible()
    assert link.get_attribute('href') == document_link_href

    link_card = detail_page.get_by_test_id(f'link-card-{data_link_href}').first
    link_card.hover()
    expect(
        detail_page.get_by_test_id(f'copy-button-{data_link_href}').first
    ).to_be_visible()

    link = link_card.get_by_role('link', name=data_link_title).first
    expect(link).to_be_visible()
    assert link.get_attribute('href') == data_link_href

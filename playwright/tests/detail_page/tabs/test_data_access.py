import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'title, uuid, link_title, link_href',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'Data Link',
            'https://imos.org.au/facilities/shipsofopportunity',
        ),
    ],
)
def test_links_sections(
    responsive_page: Page,
    title: str,
    uuid: str,
    link_title: str,
    link_href: str,
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
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    data_access = detail_page.tabs.data_access
    data_access.tab.click()

    link_card = responsive_page.get_by_test_id(f'link-card-{link_href}')
    link_card.hover()
    expect(
        responsive_page.get_by_test_id(f'copy-button-{link_href}')
    ).to_be_visible()

    link = link_card.get_by_role('link', name=link_title)
    expect(link).to_be_visible()
    assert link.get_attribute('href') == link_href

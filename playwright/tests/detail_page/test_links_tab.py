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
            'https://thredds.aodn.org.au/thredds/catalog/IMOS/SOOP/SOOP-BA/catalog.html',
        ),
    ],
)
def test_links_sections(
    page_mock: Page,
    title: str,
    uuid: str,
    link_title: str,
    link_href: str,
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    links = detail_page.tabs.links
    links.tab.click()

    link_card = links.link_cards.first
    link_card.hover()
    expect(links.copy_link_button).to_be_visible()

    expect(link_card.get_by_text(link_title)).to_be_visible()
    expect(link_card.get_by_role('link', name=link_href)).to_be_visible()

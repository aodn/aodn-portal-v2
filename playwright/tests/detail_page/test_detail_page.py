import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'title',
    [
        ('Integrated Marine Observing System (IMOS) - Location of assets'),
    ],
)
def test_page_title_and_tab_navigation(page_mock: Page, title: str) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)
    detail_page = DetailPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.click_dataset(title)

    expect(detail_page.page_title).to_have_text(title)
    expect(detail_page.abstract_map).to_be_visible()
    detail_page.click_tab('About')
    expect(detail_page.get_heading('Keywords')).to_be_visible()
    detail_page.get_button('Contacts').click()
    expect(detail_page.get_heading('Keywords')).not_to_be_in_viewport()
    detail_page.click_tab('Metadata Information')
    expect(detail_page.get_heading('Metadata Contact')).to_be_visible()
    detail_page.click_tab('Abstract')
    expect(detail_page.abstract_map).to_be_visible()

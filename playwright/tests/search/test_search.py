import pytest
from playwright.sync_api import Page, expect

from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'search_text, category_name',
    [
        ('air', 'Air temperature'),
        ('temp', 'Temperature'),
    ],
)
def test_basic_search(
    page_mock: Page, search_text: str, category_name: str
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text(search_text)
    expect(landing_page.get_option(category_name)).to_be_visible()
    landing_page.click_option(category_name)
    landing_page.search.click_search_button()
    expect(search_page.search.search_field).to_have_value(category_name)

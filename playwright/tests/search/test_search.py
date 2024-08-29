import pytest
from playwright.sync_api import Page, expect

from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'search_text, category_name',
    [
        ('air', 'air temperature'),
        ('temperature', 'temperature wind'),
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
    expect(search_page.first_result_title).to_be_visible()


def test_fail_case(page_mock: Page) -> None:
    landing_page = LandingPage(page_mock)

    landing_page.load()

    expect(
        landing_page.get_text('Australian Ocean Data Network').first
    ).to_be_visible()

    expect(
        landing_page.get_text('Open Access to Ocean Data')
    ).to_be_visible()  # This check will fail

    expect(landing_page.search.search_button).to_be_enabled()

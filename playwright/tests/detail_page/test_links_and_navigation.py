import pytest
from playwright.sync_api import Page, expect

from mocks.apply import apply_mock
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'title, tab',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            'Summary',
        ),
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            'Additional Information',
        ),
    ],
)
def test_detail_page_link_share(
    responsive_page: Page, title: str, tab: str
) -> None:
    """
    Verifies that the detail page 'Share' button allows users to copy
    a link to the page, and that the copied link correctly opens the
    corresponding detail page.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)
    detail_page = DetailPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    search_page.click_dataset(title)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.click_tab(tab)

    copied_url = detail_page.get_shared_link()

    # Open a new tab with the copied URL
    new_page = responsive_page.context.new_page()

    # Add API mocking to the new page
    apply_mock(new_page)

    new_detail_page = DetailPage(new_page)
    new_detail_page.goto(copied_url)

    expect(new_detail_page.page_title).to_have_text(title)


@pytest.mark.parametrize(
    'title, tab',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            'Summary',
        ),
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            'Additional Information',
        ),
    ],
)
def test_detail_page_return_button(
    responsive_page: Page, title: str, tab: str
) -> None:
    """
    Verifies that the detail page return button navigates back to the
    search results page.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)
    detail_page = DetailPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    search_page.click_dataset(title)
    expect(detail_page.page_title).to_have_text(title)

    detail_page.click_tab(tab)
    detail_page.return_button.click()
    expect(search_page.result_list).to_be_visible()

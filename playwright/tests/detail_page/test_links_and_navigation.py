import pytest
from playwright.sync_api import Page, expect

from mocks.api.collection_detail import (
    handle_detail_api,
    handle_detail_item_api,
)
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'title, tab, url_tab_name',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            'Summary',
            'summary',
        ),
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            'Additional Information',
            'additional-info',
        ),
    ],
)
def test_detail_page_link_share(
    responsive_page: Page, title: str, tab: str, url_tab_name: str
) -> None:
    """
    Verifies that the detail page link can be copied and that the
    copied link navigates to the correct detail page and tab.
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
    api_router = ApiRouter(new_page)
    api_router.route_collection_detail(
        handle_detail_api, handle_detail_item_api
    )

    new_detail_page = DetailPage(new_page)
    new_detail_page.goto(copied_url)

    expect(new_detail_page.page_title).to_have_text(title)

    assert new_detail_page.get_tab_name_from_url() == url_tab_name

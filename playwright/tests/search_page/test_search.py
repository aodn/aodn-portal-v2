import pytest
from playwright.sync_api import Page, expect

from mocks.api.collections import (
    handle_collections_update_all_api,
    handle_collections_update_centroid_api,
)
from mocks.api_router import ApiRouter
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
    search_page.wait_for_search_to_complete()

    expect(search_page.search.search_field).to_have_value(category_name)
    expect(search_page.first_result_title).to_be_visible()


@pytest.mark.parametrize(
    'sort_type',
    [
        'Title',
        'Popularity',
        'Modified',
    ],
)
def test_search_result_sort(page_mock: Page, sort_type: str) -> None:
    api_router = ApiRouter(page=page_mock)
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    expect(search_page.first_result_title).to_be_visible()

    # Change api route to get updated response after search action
    api_router.route_collection(
        handle_collections_update_centroid_api,
        handle_collections_update_all_api,
    )

    search_page.sort_button.click()
    search_page.click_text(sort_type)

    search_page.wait_for_search_to_complete()
    expect(search_page.first_result_title).to_be_visible()

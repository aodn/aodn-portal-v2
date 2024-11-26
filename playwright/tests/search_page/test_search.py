import pytest
from playwright.sync_api import Page, expect

from core.enums.search_sort_type import SearchSortType
from mocks.api.search_sort import (
    handle_sort_by_modified,
    handle_sort_by_relevance,
    handle_sort_by_title,
)
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
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
    [SearchSortType.TITLE, SearchSortType.MODIFIED],
)
def test_search_result_sort(page_mock: Page, sort_type: SearchSortType) -> None:
    api_router = ApiRouter(page=page_mock)
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    api_router.route_collection_all(
        handle_sort_by_relevance
    )  # Sort by relevance is the default sorting type

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    initial_first_title = search_page.first_result_title.inner_text()

    if sort_type == SearchSortType.TITLE:
        api_router.route_collection_all(
            handle_sort_by_title,
        )
    elif sort_type == SearchSortType.MODIFIED:
        api_router.route_collection_all(
            handle_sort_by_modified,
        )

    search_page.sort_button.click()
    search_page.click_text(sort_type.value, exact=True)

    search_page.wait_for_search_to_complete()
    updated_first_title = search_page.first_result_title.inner_text()

    assert initial_first_title != updated_first_title


@pytest.mark.parametrize(
    'search_text',
    [
        'plankton biomass',
    ],
)
def test_search_input_persistence_after_navigation(
    page_mock: Page, search_text: str
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)
    detail_page = DetailPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.search.fill_search_text(search_text)
    search_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.first_result_title.click()
    detail_page.go_back_button.click()

    expect(search_page.search.search_field).to_have_value(search_text)

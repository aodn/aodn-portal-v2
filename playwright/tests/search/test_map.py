import pytest
from playwright.sync_api import Page, expect

from mocks.api.collections import (
    handle_collections_update_all_api,
    handle_collections_update_bbox_api,
)
from mocks.api_router import ApiRouter
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


def test_search_on_map_drag(page_mock: Page) -> None:
    api_router = ApiRouter(page=page_mock)
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()
    initial_data = search_page.first_result_title.inner_text()

    api_router.route_collection(
        handle_collections_update_bbox_api, handle_collections_update_all_api
    )
    search_page.map.drag_map()
    search_page.wait_for_updated_search_result()
    updated_data = search_page.first_result_title.inner_text()

    assert initial_data != updated_data


@pytest.mark.parametrize(
    'title, lng, lat',
    [
        (
            'Wave buoys Observations - Australia - delayed (National Wave Archive)',
            '145.5',
            '-42.5',
        ),
    ],
)
def test_datapoint_hover_and_click(
    page_mock: Page, title: str, lng: str, lat: str
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()

    search_page.map.center_map(lng, lat)
    search_page.map.hover_map()
    expect(search_page.popup_title).to_have_text(title)

    search_page.map.click_map_data_point()
    expect(search_page.first_result_title).to_have_text(title)


@pytest.mark.parametrize(
    'search_text, updated_search_text',
    [
        ('imos', 'plankton'),
    ],
)
def test_updating_search_reflects_in_map(
    page_mock: Page, search_text: str, updated_search_text: str
) -> None:
    api_router = ApiRouter(page=page_mock)
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text(search_text)
    landing_page.search.click_search_button()
    map_layers = search_page.map.get_map_layers()

    api_router.route_collection(
        handle_collections_update_bbox_api, handle_collections_update_all_api
    )
    search_page.search.fill_search_text(updated_search_text)
    search_page.search.click_search_button()
    updated_map_layers = search_page.map.get_map_layers()

    assert map_layers != updated_map_layers

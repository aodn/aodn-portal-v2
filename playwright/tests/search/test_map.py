import pytest
from playwright.sync_api import Page, expect

from core.enums.layer_type import LayerType
from core.factories.layer import LayerFactory
from mocks.api.collections import (
    handle_collections_update_all_api,
    handle_collections_update_bbox_api,
)
from mocks.api_router import ApiRouter
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


def test_map_drag_updates_search_results(page_mock: Page) -> None:
    api_router = ApiRouter(page=page_mock)
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    initial_data = search_page.first_result_title.inner_text()

    # Change api route to get updated response after the map drag event
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
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '145.5',
            '-42.5',
        ),
    ],
)
def test_map_datapoint_hover_and_click(
    page_mock: Page, title: str, lng: str, lat: str
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.center_map(lng, lat)
    search_page.map.hover_map()

    search_page.map.click_map()
    expect(search_page.first_result_title).to_have_text(title)


@pytest.mark.parametrize(
    'search_text, updated_search_text',
    [
        ('imos', 'plankton'),
    ],
)
def test_map_updates_on_search_change(
    page_mock: Page, search_text: str, updated_search_text: str
) -> None:
    api_router = ApiRouter(page=page_mock)
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text(search_text)
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    expect(search_page.first_result_title).to_be_visible()
    map_layers = search_page.map.get_map_layers()

    # Change api route to get updated response after search action
    api_router.route_collection(
        handle_collections_update_bbox_api, handle_collections_update_all_api
    )
    search_page.search.fill_search_text(updated_search_text)
    search_page.search.click_search_button()
    page_mock.wait_for_timeout(500)
    updated_map_layers = search_page.map.get_map_layers()

    assert map_layers != updated_map_layers


@pytest.mark.parametrize(
    'layer_text, layer_type',
    [
        (
            'Australia Marine Parks',
            LayerType.MARINE_PARKS,
        ),
        (
            'World Boundaries and Places',
            LayerType.WORLD_BOUNDARIES,
        ),
    ],
)
def test_map_base_layers(
    page_mock: Page, layer_text: str, layer_type: LayerType
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    layer_factory = LayerFactory(search_page.map)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    expect(search_page.first_result_title).to_be_visible()

    search_page.map.basemap_show_hide_menu.click()
    search_page.click_text(layer_text)
    layer_id = layer_factory.get_layer_id(layer_type)
    assert search_page.map.is_map_layer_visible(layer_id) is True

    search_page.click_text(layer_text)
    assert search_page.map.is_map_layer_visible(layer_id) is False


@pytest.mark.parametrize(
    'head_lng, head_lat, data_title, data_lng, data_lat',
    [
        (
            '137.70',
            '-33.174',
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '137.70',
            '-33.174',
        ),
    ],
)
def test_map_spider(
    page_mock: Page,
    head_lng: str,
    head_lat: str,
    data_title: str,
    data_lng: str,
    data_lat: str,
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.center_map(head_lng, head_lat)
    search_page.map.hover_map()
    search_page.map.click_map()

    layer_factory = LayerFactory(search_page.map)
    layer_id = layer_factory.get_layer_id(LayerType.SPIDER)
    assert search_page.map.is_map_layer_visible(layer_id) is True

    search_page.map.center_map(data_lng, data_lat)
    search_page.map.hover_map()
    search_page.map.click_map()
    expect(search_page.first_result_title).to_have_text(data_title)

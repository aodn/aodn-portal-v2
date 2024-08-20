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

    search_page.map.click_map()
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
    expect(search_page.first_result_title).to_be_visible()
    map_layers = search_page.map.get_map_layers()

    api_router.route_collection(
        handle_collections_update_bbox_api, handle_collections_update_all_api
    )
    search_page.search.fill_search_text(updated_search_text)
    search_page.search.click_search_button()
    page_mock.wait_for_timeout(500)
    updated_map_layers = search_page.map.get_map_layers()

    assert map_layers != updated_map_layers


@pytest.mark.parametrize(
    'layer_text, layer_id',
    [
        (
            'Australia Marine Parks',
            'static-geojson-map-container-id-layer-static-australia-marine-parks',
        ),
        (
            'World Boundaries and Places',
            'mapbox-world-country-boundaries-layer',
        ),
    ],
)
def test_map_base_layer(
    page_mock: Page, layer_text: str, layer_id: str
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()
    expect(search_page.first_result_title).to_be_visible()
    assert search_page.map.is_map_layer_visible(layer_id) is False

    search_page.map.basemap_show_hide_menu.click()
    search_page.click_text(layer_text)

    assert search_page.map.is_map_layer_visible(layer_id) is True


@pytest.mark.parametrize(
    'head_lng, head_lat, title, lng, lat',
    [
        (
            '148.50000858306885',
            '-42.499994242361204',
            'IMOS - Australian National Mooring Network (ANMN) Facility - Temperature and salinity time-series',
            '148.48955941132638',
            '-42.497357343209494',
        ),
    ],
)
def test_spider(
    page_mock: Page,
    head_lng: str,
    head_lat: str,
    title: str,
    lng: str,
    lat: str,
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.fill_search_text('imos')
    landing_page.search.click_search_button()

    search_page.map.center_map(head_lng, head_lat)
    search_page.map.hover_map()
    search_page.map.click_map()

    layer_id = f'spider-lines-line-{head_lng},{head_lat}'
    assert search_page.map.is_map_layer_visible(layer_id) is True

    search_page.map.center_map(lng, lat)
    search_page.map.hover_map()

    search_page.map.click_map()
    expect(search_page.first_result_title).to_have_text(title)

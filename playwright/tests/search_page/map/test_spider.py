import pytest
from playwright.sync_api import Page

from core.enums.layer_type import LayerType
from core.factories.layer import LayerFactory
from mocks.api.collections import (
    handle_collections_update_all_api,
    handle_collections_update_centroid_api,
)
from mocks.api_router import ApiRouter
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'spider_lng, spider_lat',
    [
        (
            '137.70',
            '-33.174',
        ),
    ],
)
def test_map_spider_disappears_on_zoom_out(
    desktop_page: Page,
    spider_lng: str,
    spider_lat: str,
) -> None:
    """
    Test that spider view (expanded markers from cluster) appears on cluster click
    and disappears when zooming out.

    Steps:
    - Go to search results
    - Move to known cluster location + zoom level 12
    - Click cluster → expect spider layer
    - Zoom out → expect spider layer gone

    Parametrized coordinates are chosen because they produce a cluster at
    the tested zoom level in the current default mock dataset.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.zoom_to_level(12)
    search_page.map.center_map(spider_lng, spider_lat)
    search_page.wait_for_timeout(5000)

    # Try to find and click a cluster
    cluster_found = search_page.map.find_and_click_cluster()
    assert cluster_found is True

    # Verify spider is visible
    layer_factory = LayerFactory(search_page.map)
    layer_id = layer_factory.get_layer_id(LayerType.SPIDER)
    assert search_page.map.is_map_layer_visible(layer_id) is True

    # Verify spider disappears on zoom out
    search_page.map.zoom_out_button.click()
    search_page.wait_for_timeout(2000)
    assert search_page.map.is_map_layer_visible(layer_id) is False


@pytest.mark.parametrize(
    'spider_lng, spider_lat',
    [
        (
            '137.70',
            '-33.174',
        ),
    ],
)
@pytest.mark.skip(reason='Feature contains a bug and is being investigated.')
def test_map_spider_disappears_after_search_update(
    desktop_page: Page,
    spider_lng: str,
    spider_lat: str,
) -> None:
    """
    Test that spider view (expanded markers from cluster) appears on cluster click
    and disappears after the search is updated (new search query submitted).

    Steps:
    - Navigate to search results page
    - Center map at known cluster location + set zoom level 12
    - Click cluster → expect spider layer to become visible
    - Perform a new search by updating search query → expect spider layer to disappear

    Parametrized coordinates are chosen because they produce a cluster at
    the tested zoom level in the current default mock dataset.
    """
    api_router = ApiRouter(page=desktop_page)
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.map.zoom_to_level(12)
    search_page.map.center_map(spider_lng, spider_lat)
    search_page.wait_for_timeout(5000)

    # Try to find and click a cluster
    cluster_found = search_page.map.find_and_click_cluster()
    assert cluster_found is True

    # Verify spider is visible
    layer_factory = LayerFactory(search_page.map)
    layer_id = layer_factory.get_layer_id(LayerType.SPIDER)
    assert search_page.map.is_map_layer_visible(layer_id) is True

    # Change api mocking to get updated response after search action
    api_router.route_collection(
        handle_collections_update_centroid_api,
        handle_collections_update_all_api,
    )
    landing_page.search.fill_search_text('imos')
    search_page.wait_for_timeout(2000)
    landing_page.search.click_search_button()
    search_page.wait_for_timeout(2000)
    # Verify spider disappears on search change
    assert search_page.map.is_map_layer_visible(layer_id) is False

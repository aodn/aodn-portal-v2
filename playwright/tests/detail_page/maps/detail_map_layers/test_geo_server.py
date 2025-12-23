from http import HTTPStatus

import pytest
from playwright.sync_api import Page, expect

from core.enums.layer_type import LayerType
from core.factories.layer import LayerFactory
from mocks.api.wms_map import create_api_handler
from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid',
    [
        '1fba3a57-35f4-461b-8a0e-551af229714e',
    ],
)
def test_map_shows_geoserver_layer_with_timeSlider_and_drawRect_support(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset with a WMS link and GeoServer map fields that support time and map subsetting.
    It verifies that the GeoServer layer appears on the map with time slider and draw rectangle functionality.
    This test ensures that:
    1. The WMS link header is visible in the UI
    2. A GeoServer layer is added to the map and is visible
    3. Both the time slider and the draw rectangle button are visible on the map
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    expect(detail_page.wms_link_header).to_be_visible()

    # Ensure that the GeoServer option is displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Verify that the Geoserver layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )
    # Verify that the time slider and draw rectangle button are visible
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '1fba3a57-35f4-461b-8a0e-551af229714e',
    ],
)
def test_map_shows_geoserver_layer_with_only_timeSlider_support(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset with a WMS link and GeoServer map fields that support only time subsetting.
    It verifies that the GeoServer layer appears on the map with time slider functionality.
    This test ensures that:
    1. The WMS link header is visible in the UI
    2. A GeoServer layer is added to the map and is visible
    3. The time slider button is visible on the map
    4. The draw rectangle button is not visible on the map
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)
    # Mock WMS downloadable fields API to support only time subsetting
    wms_downloadable_fields_handler = create_api_handler(
        is_time_supported=True, is_geometry_supported=False
    )
    api_router = ApiRouter(responsive_page)
    api_router.route_wms_downloadable_fields(wms_downloadable_fields_handler)

    detail_page.load(uuid)
    expect(detail_page.wms_link_header).to_be_visible()

    # Ensure that the GeoServer option is displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Verify that the Geoserver layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )
    # Verify that the time slider button is visible
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    # Verify that the draw rectangle button is not visible
    expect(detail_page.detail_map.draw_rect_menu_button).not_to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '1fba3a57-35f4-461b-8a0e-551af229714e',
    ],
)
def test_map_shows_geoserver_layer_with_only_drawRect_support(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset with a WMS link and GeoServer map fields that support only draw rectangle subsetting.
    It verifies that the GeoServer layer appears on the map with draw rectangle functionality.
    This test ensures that:
    1. The WMS link header is visible in the UI
    2. A GeoServer layer is added to the map and is visible
    3. The draw rectangle button is visible on the map
    4. The time slider button is not visible on the map
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)
    # Mock WMS downloadable fields API to support only draw rectangle subsetting
    wms_downloadable_fields_handler = create_api_handler(
        is_time_supported=False, is_geometry_supported=True
    )
    api_router = ApiRouter(responsive_page)
    api_router.route_wms_downloadable_fields(wms_downloadable_fields_handler)

    detail_page.load(uuid)
    expect(detail_page.wms_link_header).to_be_visible()

    # Ensure that the GeoServer option is displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Verify that the Geoserver layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )
    # Verify that the draw rectangle button is visible
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()
    # Verify that the time slider button is not visible
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).not_to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '69e9ac91-babe-47ed-8c37-0ef08f29338a',
    ],
)
def test_map_shows_geoserver_layer_without_timeSlider_and_drawRect_support(
    responsive_page: Page, uuid: str
) -> None:
    """
    This test uses a dataset with a WMS link but no associated GeoServerMapFields available for the layer.
    It verifies that the GeoServer layer appears on the map without any subsetting support.
    This test ensures that:
    1. The WMS link header is visible in the UI
    2. A GeoServer layer is added to the map and is visible
    3. Both the time slider and the draw rectangle button are not visible on the map
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)
    # Mock WMS downloadable fields API to return 404 Not Found
    api_router = ApiRouter(responsive_page)
    api_router.route_wms_downloadable_fields(
        lambda route: route.fulfill(status=HTTPStatus.NOT_FOUND)
    )

    detail_page.load(uuid)
    expect(detail_page.wms_link_header).to_be_visible()

    # Ensure that the GeoServer option is displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()

    # Verify that the Geoserver layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )
    # Verify that the time slider and draw rectangle button are not visible
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).not_to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).not_to_be_visible()


@pytest.mark.parametrize(
    'uuid',
    [
        '4739e4b0-4dba-4ec5-b658-02c09f27ab9a',  # Not on whitelist
    ],
)
def test_data_not_on_whitelist(desktop_page: Page, uuid: str) -> None:
    """
    This test uses a dataset with a WMS link and bounding box coordinates, but the dataset is not on the whitelist.
    As a result, the WMS downloadable fields API returns an unauthorized error.
    It verifies that the GeoServer layer does not appear on the map, while the Spatial Extent layer is displayed.
    """
    detail_page = DetailPage(desktop_page)
    # Mock WMS downloadable fields API to return 401 Unauthorized
    api_router = ApiRouter(desktop_page)
    api_router.route_wms_downloadable_fields(
        lambda route: route.fulfill(status=HTTPStatus.UNAUTHORIZED)
    )
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.detail_map.wait_for_map_loading()

    # Ensure that the Spatial Extent option is displayed in the layers menu
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.spatial_extent_layer).to_be_visible()

    # Verify that the Spatial Extent layer is present and visible on the map
    layer_id = layer_factory.get_layer_id(LayerType.SPATIAL_EXTENT)
    assert detail_page.detail_map.is_map_layer_visible(layer_id) is True

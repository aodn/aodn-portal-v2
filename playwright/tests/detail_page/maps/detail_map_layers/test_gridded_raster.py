from urllib.parse import unquote

import pytest
from playwright.sync_api import Page, expect

from core.enums.map_layers.layer_style import LayerStyle
from core.factories.layer import LayerFactory
from mocks.api.gridded_tiles import (
    PRODUCT_ONE_DATES,
    PRODUCT_TWO_DATES,
    SUPPORTED_UUID,
    UNSUPPORTED_UUID,
    handle_gridded_tile_products_failure,
)
from mocks.api_router import ApiRouter
from mocks.routes import Routes
from pages.detail_page import DetailPage

TILE_PATH_FRAGMENT = '/map/tiles/WebMercatorQuad/'


def _collect_tile_requests(page: Page) -> list[str]:
    """Record every raster tile URL the map asks for."""
    urls: list[str] = []
    page.on(
        'request',
        lambda request: (
            urls.append(request.url)
            if TILE_PATH_FRAGMENT in request.url
            else None
        ),
    )
    return urls


def _open_gridded_layer(detail_page: DetailPage) -> None:
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.gridded_data_layer.check()
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.wait_for_map_idle()


def test_gridded_layer_appears_only_for_a_catalogued_collection(
    responsive_page: Page,
) -> None:
    """
    Assertions 1 and 12: the switcher entry appears for a collection with
    products and not for one whose listing is empty, and an empty listing is not
    an error.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(SUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.gridded_data_layer).to_be_visible()
    detail_page.detail_map.layers_menu.click()

    detail_page.load(UNSUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()
    detail_page.detail_map.layers_menu.click()
    expect(detail_page.detail_map.gridded_data_layer).to_have_count(0)
    # An empty listing is a normal 200, not a failure.
    expect(detail_page.detail_map.gridded_raster_error).to_have_count(0)


def test_gridded_layer_renders_and_offers_only_visual_products(
    responsive_page: Page,
) -> None:
    """
    Assertions 2 and 3: selecting Gridded Data reveals the product dropdown and
    the date menu, and the data-only product is absent from the dropdown.
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(SUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()

    _open_gridded_layer(detail_page)

    layer_id = layer_factory.get_layer_id(LayerStyle.GRIDDED_RASTER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

    expect(detail_page.dataset_selection_dropdown).to_be_visible()
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()

    detail_page.dataset_selection_dropdown.click()
    options = responsive_page.get_by_role('option')
    expect(options).to_have_count(2)
    # Data-only products carry no visual tile template and must not be offered.
    expect(responsive_page.get_by_role('option', name='temp')).to_have_count(0)
    responsive_page.keyboard.press('Escape')


def test_gridded_date_point_slider_coexists_with_the_range_slider(
    responsive_page: Page,
) -> None:
    """
    Assertions 4, 5 and 6: the date menu shows one point thumb plus the
    unchanged two-thumb range slider, the point defaults to the selected
    product's latest day, and moving it requests tiles through the OGC route
    carrying that exact day — never through a DAS path.
    """
    detail_page = DetailPage(responsive_page)
    tile_urls = _collect_tile_requests(responsive_page)

    detail_page.load(SUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()
    _open_gridded_layer(detail_page)

    detail_page.detail_map.daterange_show_hide_menu_button.click()

    # One point thumb plus the range slider's two thumbs.
    expect(responsive_page.get_by_role('slider')).to_have_count(3)
    expect(detail_page.detail_map.date_slider).to_have_count(2)

    latest = PRODUCT_ONE_DATES[-1]
    expect(
        responsive_page.get_by_text(f'Displaying @ {latest}')
    ).to_be_visible()

    detail_page.detail_map.wait_for_map_idle()
    assert any(f'datetime={latest}' in url for url in tile_urls)

    # Step back one day and confirm the request follows.
    thumb = responsive_page.get_by_role('slider').first
    thumb.focus()
    responsive_page.keyboard.press('ArrowLeft')
    previous = PRODUCT_ONE_DATES[-2]
    expect(
        responsive_page.get_by_text(f'Displaying @ {previous}')
    ).to_be_visible()

    responsive_page.wait_for_timeout(1000)
    detail_page.detail_map.wait_for_map_idle()
    assert any(f'datetime={previous}' in url for url in tile_urls)

    # Every tile goes through the ogcapi collection route, and nothing anywhere
    # touches a DAS path.
    assert all('/api/v1/ogc/collections/' in url for url in tile_urls)
    assert not any('/api/v1/das' in url for url in tile_urls)


def test_switching_product_resets_the_day_and_the_tile_url(
    responsive_page: Page,
) -> None:
    """
    Assertions 7 and 8: changing product moves the point to *that* product's
    latest day and updates the tile URL, and none of it creates a download
    date-range condition.
    """
    detail_page = DetailPage(responsive_page)
    tile_urls = _collect_tile_requests(responsive_page)

    detail_page.load(SUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()
    _open_gridded_layer(detail_page)

    detail_page.dataset_selection_dropdown.click()
    responsive_page.get_by_role('option').nth(1).click()
    detail_page.detail_map.wait_for_map_idle()

    detail_page.detail_map.daterange_show_hide_menu_button.click()
    second_latest = PRODUCT_TWO_DATES[-1]
    expect(
        responsive_page.get_by_text(f'Displaying @ {second_latest}')
    ).to_be_visible()

    responsive_page.wait_for_timeout(1000)
    assert any(f'datetime={second_latest}' in url for url in tile_urls)
    # The two-variable product's %2B must survive to the wire: an unencoded '+'
    # decodes to a space and 400s.
    two_variable = [url for url in tile_urls if 'ucur' in unquote(url).lower()]
    assert two_variable
    assert all('%2B' in url for url in two_variable)
    assert all('%252B' not in url for url in two_variable)

    # The download date-range condition belongs to the range slider; opening the
    # clock panel is what creates it. Moving the *point* must leave it exactly as
    # it was — the map day is not a download condition.
    conditions_before = detail_page.date_range_condition_box.count()
    text_before = (
        detail_page.date_range_condition_box.first.inner_text()
        if conditions_before
        else ''
    )

    thumb = responsive_page.get_by_role('slider').first
    thumb.focus()
    responsive_page.keyboard.press('ArrowLeft')
    expect(
        responsive_page.get_by_text(f'Displaying @ {PRODUCT_TWO_DATES[-2]}')
    ).to_be_visible()
    responsive_page.wait_for_timeout(1000)

    expect(detail_page.date_range_condition_box).to_have_count(
        conditions_before
    )
    if conditions_before:
        assert (
            detail_page.date_range_condition_box.first.inner_text()
            == text_before
        )


def test_switching_product_does_not_retain_a_shared_non_latest_date(
    responsive_page: Page,
) -> None:
    """
    Regression: product two's date list intentionally shares '2024-01-05' with
    product one's non-latest, middle date. MapPanel used to keep a date
    override across a product switch whenever the retained date string was
    still valid for the *new* product — with fully disjoint date lists that
    never happens, so it went unnoticed. With an overlapping date, the
    remounted slider would show product two's latest day while the tile
    request kept using the stale, shared day from product one.
    """
    detail_page = DetailPage(responsive_page)
    tile_urls = _collect_tile_requests(responsive_page)

    detail_page.load(SUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()
    _open_gridded_layer(detail_page)

    # Move product one's point off its latest day, onto the day shared with
    # product two.
    detail_page.detail_map.daterange_show_hide_menu_button.click()
    thumb = responsive_page.get_by_role('slider').first
    thumb.focus()
    responsive_page.keyboard.press('ArrowLeft')
    shared_date = PRODUCT_ONE_DATES[-2]
    expect(
        responsive_page.get_by_text(f'Displaying @ {shared_date}')
    ).to_be_visible()
    responsive_page.wait_for_timeout(1000)
    assert any(f'datetime={shared_date}' in url for url in tile_urls)

    # Switch to product two, whose own dates also contain that shared date —
    # but whose latest day is a different one.
    detail_page.dataset_selection_dropdown.click()
    responsive_page.get_by_role('option').nth(1).click()
    detail_page.detail_map.wait_for_map_idle()

    detail_page.detail_map.daterange_show_hide_menu_button.click()
    product_two_latest = PRODUCT_TWO_DATES[-1]
    assert product_two_latest != shared_date
    expect(
        responsive_page.get_by_text(f'Displaying @ {product_two_latest}')
    ).to_be_visible()

    responsive_page.wait_for_timeout(1000)
    assert any(f'datetime={product_two_latest}' in url for url in tile_urls)
    # The stale, shared date must not be what actually got requested once
    # product two is selected.
    two_variable_urls = [url for url in tile_urls if 'ucur' in url.lower()]
    assert two_variable_urls
    assert not any(
        f'datetime={shared_date}' in url for url in two_variable_urls
    )


def test_gridded_layer_survives_a_basemap_switch_and_hides_on_layer_change(
    responsive_page: Page,
) -> None:
    """
    Assertions 9 and 10: switching base map style keeps the raster, and
    switching to another map layer hides both the raster and its dropdown.
    """
    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(SUPPORTED_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()
    _open_gridded_layer(detail_page)

    layer_id = layer_factory.get_layer_id(LayerStyle.GRIDDED_RASTER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

    detail_page.detail_map.basemap_show_hide_menu.click()
    responsive_page.get_by_role('radio').last.check()
    detail_page.detail_map.basemap_show_hide_menu.click()
    detail_page.detail_map.wait_for_map_idle()

    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

    # Switch away: the raster is hidden via setLayoutProperty, not removed, and
    # the dropdown goes with it. Switch to GeoServer — Spatial Extent is no
    # longer an option once Gridded Data is available (it is suppressed
    # whenever gridded products exist). GeoServer renders its own
    # MapLayerSelect under the same test id as gridded's, so instead of
    # asserting the dropdown is gone we assert gridded's own product label is
    # no longer shown — GeoServer's dropdown reflects its own WMS layers.
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.geoserver_layer.check()
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.wait_for_map_idle()

    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is False
    )
    # "CHL_OC3" is product one's variable (mocks/api/gridded_tiles.py) and the
    # default-selected product's label — unique to gridded's own dropdown.
    expect(responsive_page.get_by_text('CHL_OC3')).to_have_count(0)


@pytest.mark.parametrize('uuid', [SUPPORTED_UUID])
def test_failed_discovery_leaves_the_rest_of_the_page_interactive(
    responsive_page: Page, uuid: str
) -> None:
    """
    Assertion 11: a first-load discovery failure is silent — no switcher entry,
    no banner — and every other layer stays interactive.
    """
    api_router = ApiRouter(responsive_page)
    responsive_page.unroute(Routes.GRIDDED_TILE_PRODUCTS)
    api_router.route_gridded_tile_products(handle_gridded_tile_products_failure)

    detail_page = DetailPage(responsive_page)
    layer_factory = LayerFactory(detail_page.detail_map)

    detail_page.load(uuid)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_layer_select_loading()

    detail_page.detail_map.layers_menu.click()
    # Failure and "genuinely no products" are indistinguishable from the
    # browser, so neither shows an entry and neither shows a banner.
    expect(detail_page.detail_map.gridded_data_layer).to_have_count(0)
    expect(detail_page.detail_map.gridded_raster_error).to_have_count(0)

    # The rest of the map still works.
    expect(detail_page.detail_map.geoserver_layer).to_be_visible()
    detail_page.detail_map.geoserver_layer.check()
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.wait_for_map_idle()
    layer_id = layer_factory.get_layer_id(LayerStyle.GEO_SERVER)
    assert (
        detail_page.detail_map.is_map_layer_visible(
            layer_id, is_map_loading=False
        )
        is True
    )

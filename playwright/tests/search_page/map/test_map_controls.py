from typing import Literal

import pytest
from playwright.sync_api import Locator, Page, expect

from core.enums.map_layers.reference_layer import ReferenceLayer
from core.factories.layer import LayerFactory
from pages.components.map import Map
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage

_TRANSPARENT = 'rgba(0, 0, 0, 0)'
_DROP_SHADOW = 'rgba(0, 0, 0, 0.1) 4px 4px 4px 0px'
_KEYBOARD_RING = 'rgb(0, 150, 255) 0px 0px 2px 2px'
_DETAIL_UUID = '0015db7e-e684-7548-e053-08114f8cd4ad'


def _assert_control_order_invariant(
    map_component: Map,
    button: Locator,
    expected: dict[str, str],
    order: Literal['before', 'after'],
) -> None:
    """Check intended styling, then compare it with the opposite CSS order."""
    snapshots = []
    opposite: Literal['before', 'after'] = (
        'after' if order == 'before' else 'before'
    )
    for position in (order, opposite):
        map_component.set_vendor_stylesheet_order(position)
        for property_name, value in expected.items():
            expect(button).to_have_css(property_name, value)
        snapshots.append(map_component.control_styles(button))
    assert snapshots[0] == snapshots[1]


def _assert_menu_styles(
    map_component: Map, order: Literal['before', 'after']
) -> None:
    expect(map_component.menu_buttons.first).to_be_visible()
    map_component.close_bookmark_menu()
    map_component.hover_map()
    for button in map_component.menu_buttons.all():
        _assert_control_order_invariant(
            map_component,
            button,
            {
                'display': 'flex',
                'width': '38px',
                'height': '38px',
                'padding': '2px',
                'border-radius': '6px',
                'background-color': _TRANSPARENT,
            },
            order,
        )
        styles = map_component.control_styles(button)
        assert styles['groupBackground'] == _TRANSPARENT
        assert styles['groupShadow'] == 'none'
        assert styles['groupMargin'] == '0px'

    basemap = map_component.container.get_by_test_id(
        'basemap-show-hide-menu-button'
    )
    basemap.hover()
    _assert_control_order_invariant(
        map_component,
        basemap,
        {'background-color': 'rgb(197, 216, 231)'},
        order,
    )
    basemap.click()
    _assert_control_order_invariant(
        map_component,
        basemap,
        {'background-color': 'rgb(59, 110, 143)'},
        order,
    )
    _assert_control_order_invariant(
        map_component,
        map_component.basemap_close_button,
        {'width': '26px', 'height': '26px', 'border-radius': '50%'},
        order,
    )
    map_component.basemap_close_button.click()


def _assert_draw_styles(
    map_component: Map, order: Literal['before', 'after']
) -> None:
    reset = map_component.reset_button
    expect(reset).to_be_disabled()
    _assert_control_order_invariant(
        map_component,
        reset,
        {
            'width': '42px',
            'height': '42px',
            'border-radius': '50%',
            'box-shadow': _DROP_SHADOW,
            'cursor': 'not-allowed',
        },
        order,
    )
    map_component.rectangle_menu_button.click()
    _assert_control_order_invariant(
        map_component,
        map_component.rectangle_menu_button,
        {'background-color': 'rgb(59, 110, 143)'},
        order,
    )
    map_component.draw_rectangle()
    expect(reset).to_be_enabled()

    # Tab establishes keyboard modality; focus targets this map's reset even
    # when another map or the searchbar is also mounted.
    map_component.page.keyboard.press('Tab')
    reset.focus()
    _assert_control_order_invariant(
        map_component,
        reset,
        {'box-shadow': _KEYBOARD_RING},
        order,
    )

    map_component.click_map_center()
    reset.hover()
    # Mousedown focuses without invoking reset yet. The mouseup below then
    # exercises the real reset handler, which disables the button.
    map_component.page.mouse.down()
    try:
        _assert_control_order_invariant(
            map_component,
            reset,
            {'box-shadow': _DROP_SHADOW},
            order,
        )
    finally:
        map_component.page.mouse.up()
    expect(reset).to_be_disabled()

    map_component.polygon_menu_button.click()
    _assert_control_order_invariant(
        map_component,
        map_component.polygon_menu_button,
        {'background-color': 'rgb(59, 110, 143)'},
        order,
    )
    expect(map_component.canvas).to_have_css('cursor', 'crosshair')
    map_component.polygon_menu_button.click()


@pytest.mark.parametrize('order', ['before', 'after'])
def test_search_map_stylesheet_order(
    desktop_page: Page, order: Literal['before', 'after']
) -> None:
    """Cold search keeps menu geometry and fullscreen layout in either order."""
    search_page = SearchPage(desktop_page)
    search_page.load()
    search_page.map.wait_for_map_loading()
    _assert_menu_styles(search_page.map, order)
    _assert_control_order_invariant(
        search_page.map,
        search_page.map.full_screen_toggle_button,
        {
            'display': 'flex',
            'width': '30px',
            'height': '30px',
            'background-color': _TRANSPARENT,
        },
        order,
    )
    expect(search_page.map.attribution).to_be_visible()
    expect(search_page.map.scale).to_be_hidden()


@pytest.mark.parametrize('order', ['before', 'after'])
def test_detail_map_stylesheet_order(
    responsive_page: Page, order: Literal['before', 'after']
) -> None:
    """Cold detail preserves draw states, mouse shadow and keyboard focus ring."""
    detail_page = DetailPage(responsive_page)
    detail_page.load(_DETAIL_UUID)
    detail_page.go_to_map_tab()
    detail_page.detail_map.wait_for_map_loading()
    detail_page.detail_map.wait_for_layer_select_loading()
    _assert_menu_styles(detail_page.detail_map, order)
    _assert_draw_styles(detail_page.detail_map, order)


@pytest.mark.parametrize('order', ['before', 'after'])
def test_location_map_stylesheet_order(
    desktop_page: Page, order: Literal['before', 'after']
) -> None:
    """Opening location on landing keeps controls stable in either CSS order."""
    landing_page = LandingPage(desktop_page)
    location_map = Map(desktop_page, 'location-filter-map')
    landing_page.load()
    landing_page.search.location_button.click()
    location_map.wait_for_map_loading()
    _assert_menu_styles(location_map, order)
    _assert_draw_styles(location_map, order)


def test_map_stylesheet_order_after_navigation(desktop_page: Page) -> None:
    """Search/detail/back and later location loading preserve map styling."""
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)
    location_map = Map(desktop_page, 'location-filter-map')
    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    _assert_menu_styles(search_page.map, 'after')
    search_page.first_result_title.click()
    detail_page.detail_map.wait_for_map_loading()
    _assert_menu_styles(detail_page.detail_map, 'after')
    detail_page.return_button.click()
    search_page.map.wait_for_map_loading()
    _assert_menu_styles(search_page.map, 'after')
    search_page.search.location_button.click()
    location_map.wait_for_map_loading()
    _assert_menu_styles(location_map, 'after')


@pytest.mark.parametrize(
    'layer_text, layer_type',
    [
        (
            'Allen Coral Atlas',
            ReferenceLayer.ALLEN_CORAL_ATLAS,
        ),
        (
            'Australian Marine Parks',
            ReferenceLayer.MARINE_PARKS,
        ),
        (
            'Marine Ecoregion of the World',
            ReferenceLayer.MARINE_ECOREGION,
        ),
        (
            'World Boundaries and Places',
            ReferenceLayer.WORLD_BOUNDARIES,
        ),
    ],
)
def test_map_reference_layers(
    desktop_page: Page, layer_text: str, layer_type: ReferenceLayer
) -> None:
    """
    Validates that selecting a reference layer from the map menu correctly
    displays the corresponding layer on the map and toggling it off hides the layer.

    The test confirms the selection functionality by verifying that the map shows the
    expected layer for the chosen reference layer and ensures the layer is hidden
    when deselected, confirming the UI's layer toggle behavior works as intended.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    layer_factory = LayerFactory(search_page.map)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_page_stabilization()
    expect(search_page.first_result_title).to_be_visible()

    search_page.map.reference_layer_menu.click()
    search_page.click_text(layer_text)
    search_page.wait_for_page_stabilization()

    layer_id = layer_factory.get_layer_id(layer_type)
    assert search_page.map.is_map_layer_visible(layer_id) is True

    if not search_page.get_text(layer_text).is_visible():
        search_page.map.reference_layer_menu.click()
    search_page.click_text(layer_text)
    assert search_page.map.is_map_layer_visible(layer_id) is False


@pytest.mark.parametrize(
    'hint_text',
    [
        'Base Layers',
    ],
)
def test_map_button_hint_tooltip(desktop_page: Page, hint_text: str) -> None:
    """
    Validates that hovering over a map control button shows a hint tooltip,
    and that the tooltip is hidden when the button's menu is open.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_page_stabilization()

    hint_locator = desktop_page.get_by_text(hint_text, exact=True)

    # Hover over the basemap button — hint should appear
    search_page.map.basemap_show_hide_menu.hover()
    expect(hint_locator).to_be_visible()

    # Click to open the menu — hint should be hidden while menu is open
    search_page.map.basemap_show_hide_menu.click()
    expect(hint_locator).not_to_be_visible()


@pytest.mark.parametrize(
    'data_title',
    [
        'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
    ],
)
def test_map_buttons(desktop_page: Page, data_title: str) -> None:
    """
    Ensures that the map buttons on both the search page and the detail page are displayed correctly.

    This test addresses a previously identified issue where modifications to the search page map buttons
    caused the detail page map buttons to disappear. By verifying the visibility of map buttons on
    both pages, it ensures that all expected map buttons are present in their respective contexts.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    # Check the visibility of search page map buttons
    expect(search_page.map.bookmarks_icon).to_be_visible()
    expect(search_page.map.basemap_show_hide_menu).to_be_visible()
    expect(search_page.map.reference_layer_menu).to_be_visible()
    expect(search_page.map.layers_menu).to_be_visible()

    search_page.result_title.get_by_text(data_title).click()
    detail_page.detail_map.wait_for_map_loading()
    detail_page.detail_map.wait_for_map_idle()

    # Check the visibility of detail page map buttons
    expect(detail_page.detail_map.basemap_show_hide_menu).to_be_visible()
    expect(search_page.map.reference_layer_menu).to_be_visible()
    expect(detail_page.detail_map.layers_menu).to_be_visible()
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()
    expect(detail_page.detail_map.reset_selections_button).to_be_visible()

    # Data Density is default once the `.metadata` probe succeeds; map idle
    # can close the layer menu before GeoServer is clickable.
    detail_page.detail_map.open_layers_menu_until_visible(
        detail_page.detail_map.geoserver_layer
    )
    detail_page.detail_map.geoserver_layer.click()

    # users now should be able to draw a rectangle and select a date range in any layers
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()

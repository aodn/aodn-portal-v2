import pytest
from playwright.sync_api import Page, expect

from core.enums.map_layers.reference_layer import ReferenceLayer
from core.factories.layer import LayerFactory
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


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

    # Check the visibility of detail page map buttons
    expect(detail_page.detail_map.basemap_show_hide_menu).to_be_visible()
    expect(search_page.map.reference_layer_menu).to_be_visible()
    expect(detail_page.detail_map.layers_menu).to_be_visible()
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()
    expect(detail_page.detail_map.delete_button).to_be_visible()

    # Select the Geoserver layer
    detail_page.detail_map.layers_menu.click()
    detail_page.detail_map.geoserver_layer.click()

    # users now should be able to draw a rectangle and select a date range in any layers
    expect(
        detail_page.detail_map.daterange_show_hide_menu_button
    ).to_be_visible()
    expect(detail_page.detail_map.draw_rect_menu_button).to_be_visible()

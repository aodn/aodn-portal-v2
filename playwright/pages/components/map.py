import random

from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.js_scripts.js_utils import (
    execute_map_js,
    load_map_js_functions,
    wait_for_js_function,
)


class Map(BasePage):
    def __init__(self, page: Page):
        self.page = page
        load_map_js_functions(page)

        # Page locators
        self.bookmarks_icon = page.get_by_test_id('BookmarksIcon')
        self.basemap_show_hide_menu = page.get_by_test_id('PublicIcon')
        self.layers_icon = page.get_by_test_id('LayersIcon')

        self.daterange_show_hide_menu_button = page.get_by_test_id(
            'daterange-show-hide-menu-button'
        )
        self.draw_rect_menu_button = page.get_by_test_id(
            'draw-rect-menu-button'
        )
        self.delete_button = self.get_button('Delete')

    def hover_map(self) -> None:
        """Move the mouse cursor to the center of the map"""
        self.page.get_by_label('Map', exact=True).hover()

    def drag_map(self) -> None:
        """Drag the map to a fixed distance using the mouse"""
        self.hover_map()
        # Calculate the center coordinates
        bounding_box = self.page.get_by_label('Map', exact=True).bounding_box()
        x, y = 0.0, 0.0
        if bounding_box is not None:
            x = bounding_box['x'] + bounding_box['width'] / 2
            y = bounding_box['y'] + bounding_box['height'] / 2

        self.page.mouse.down()
        self.page.mouse.move(x + 150, y + 50)  # fixed mouse move
        self.page.mouse.up()

    def center_map(self, lng: str, lat: str) -> None:
        """Center the map to a given longitude and latitude coordinates"""
        execute_map_js(self.page, 'centerMap', lng, lat, '12')
        self.wait_for_map_loading()

    def wait_for_map_loading(self) -> None:
        """Wait until the map is fully loaded"""
        wait_for_js_function(self.page, 'isMapLoaded')

    def click_map(self) -> None:
        """Click the map at the current position of the mouse"""
        self.page.mouse.down()
        self.page.mouse.up()

    def get_map_layers(self) -> str:
        """Get the total number of heatmap layers"""
        self.wait_for_map_loading()
        layers = execute_map_js(self.page, 'getMapLayers')
        return str(layers)

    def get_Layer_id_from_test_props(self, layer_function_name: str) -> str:
        """Get specific layer id"""
        self.wait_for_map_loading()
        layer_id = execute_map_js(self.page, layer_function_name)
        return str(layer_id)

    def get_AU_Marine_Parks_Layer_id(self) -> str:
        """Get the Australian Marine Parks layer id"""
        return self.get_Layer_id_from_test_props('getAUMarineParksLayer')

    def get_World_Boundaries_Layer_id(self) -> str:
        """Get the World Boundaries layer id"""
        return self.get_Layer_id_from_test_props('getWorldBoundariesLayer')

    def get_Spider_Layer_id(self) -> str:
        """Get the Spider layer id"""
        return self.get_Layer_id_from_test_props('getSpiderLayer')

    def is_map_layer_visible(self, layer_id: str) -> bool:
        """Check whether a given map layer is visible"""
        self.wait_for_map_loading()
        is_visible = execute_map_js(self.page, 'isMapLayerVisible', layer_id)
        return is_visible

    def zoom_to_level(self, zoom_level: float = random.uniform(4, 6)) -> None:
        """
        Zoom the map to a specified zoom level.  If not specified, a random zoom level between 4 and 6 will be applied.

        Args:
            zoom_level (float, optional): The zoom level to set the map to. Defaults to random.uniform(4, 6).
        """
        execute_map_js(self.page, 'zoomToLevel', zoom_level)

    def get_map_center(self) -> dict:
        """Get the current center coordinates of the map"""
        map_center = execute_map_js(self.page, 'getMapCenter')
        return dict(map_center)

    def get_map_zoom(self) -> float:
        """Get the current zoom level of the map"""
        map_zoom = execute_map_js(self.page, 'getMapZoom')
        return float(map_zoom)

    def find_and_click_cluster(self) -> bool:
        """Find and click on a cluster on the map"""
        return execute_map_js(self.page, 'findAndClickCluster')

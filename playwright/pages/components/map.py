import random

from playwright.sync_api import Page, TimeoutError

from pages.base_page import BasePage
from pages.js_scripts.js_utils import (
    execute_map_js,
    load_map_js_functions,
    wait_for_js_function,
)


class Map(BasePage):
    def __init__(self, page: Page, map_id: str):
        self.page = page
        self.map_id = map_id
        load_map_js_functions(page)

        # Page locators
        self.full_screen_toggle_button = self.get_by_id(
            'map-toggle-control-button'
        )
        self.zoom_in_button = self.get_label('Zoom In')
        self.zoom_out_button = self.get_label('Zoom Out')
        self.bookmarks_icon = self.get_by_id('bookmark-list-button')
        self.basemap_show_hide_menu = page.get_by_test_id(
            'basemap-show-hide-menu-button'
        )
        self.reference_layer_menu = page.get_by_test_id(
            'reference-show-hide-menu-button'
        )
        self.layers_menu = self.get_by_id('layer-show-hide-menu-button')
        self.hex_grid_layer = page.get_by_role('radio', name='Hex Grid')
        self.geoserver_layer = page.get_by_role('radio', name='GeoServer')
        self.spatial_extent_layer = page.get_by_role(
            'radio', name='Spatial Extent'
        )

        self.daterange_show_hide_menu_button = page.get_by_test_id(
            'daterange-show-hide-menu-button'
        )
        self.draw_rect_menu_button = page.get_by_test_id(
            'draw-rect-menu-button'
        )
        self.delete_button = self.get_button('Delete')
        self.date_slider = page.get_by_test_id(
            'dateslider-daterange-menu-button'
        )

    def hover_map(self) -> None:
        """Move the mouse cursor to the center of the map"""
        self.get_by_id(self.map_id).hover()

    def calculate_mouse_coordinates(
        self, left: int = 0, right: int = 0, up: int = 0, down: int = 0
    ) -> tuple[float, float]:
        """
        Calculate the new mouse coordinates based on the specified distances.

        Args:
            left (int, optional): Number of pixels to move to the left. Defaults to 0.
            right (int, optional): Number of pixels to move to the right. Defaults to 0.
            up (int, optional): Number of pixels to move upwards. Defaults to 0.
            down (int, optional): Number of pixels to move downwards. Defaults to 0.

        Returns:
            tuple[float, float]: The new x and y coordinates.
        """
        # Calculate the center coordinates
        bounding_box = self.get_by_id(self.map_id).bounding_box()
        x, y = 0.0, 0.0
        if bounding_box is not None:
            x = bounding_box['x'] + bounding_box['width'] / 2
            y = bounding_box['y'] + bounding_box['height'] / 2

        # Calculate the new coordinates
        if any([left, right, up, down]):
            x += right - left  # Combine horizontal movements
            y += down - up  # Combine vertical movements
        else:
            # If no parameters are passed, perform a fixed distance movement
            x += 150
            y += 50

        return x, y

    def drag_map(
        self, left: int = 0, right: int = 0, up: int = 0, down: int = 0
    ) -> None:
        """
        Drag the map to a specified distance using the mouse.

        This method drags the map by a specified number of pixels in the left, right, up,
        or down directions from the center of the map. If no direction is specified,
        it performs a default drag of 150 pixels to the right and 50 pixels down.

        Args:
            left (int, optional): Number of pixels to drag to the left. Defaults to 0.
            right (int, optional): Number of pixels to drag to the right. Defaults to 0.
            up (int, optional): Number of pixels to drag upwards. Defaults to 0.
            down (int, optional): Number of pixels to drag downwards. Defaults to 0.

        Returns:
            None
        """
        self.hover_map()  # Moves the mouse to the center of the map

        # Calculate the new coordinates
        x, y = self.calculate_mouse_coordinates(left, right, up, down)

        # Perform the drag
        self.page.mouse.down()
        self.page.mouse.move(x, y)
        self.page.mouse.up()

    def center_map(self, lng: str, lat: str) -> None:
        """Center the map to a given longitude and latitude coordinates"""
        execute_map_js(self.page, 'centerMap', self.map_id, lng, lat)
        self.wait_for_map_loading()

    def wait_for_map_loading(self) -> None:
        """Wait until the map is fully loaded"""
        self.page.wait_for_selector(f'#{self.map_id}', state='attached')
        try:
            wait_for_js_function(self.page, 'isMapLoaded', 20000, self.map_id)
        except TimeoutError:
            pass  # Continue even if the map fails to load within the timeout

    def wait_for_map_idle(self) -> None:
        """Wait until the map is fully loaded"""
        self.page.wait_for_selector(f'#{self.map_id}', state='attached')
        try:
            self.page.wait_for_timeout(1000)
            wait_for_js_function(self.page, 'isMapIdle', 20000, self.map_id)
        except TimeoutError:
            pass  # Continue even if the map fails to load within the timeout

    def click_map(self) -> None:
        """Click the map at the current position of the mouse"""
        self.page.mouse.down()
        self.page.mouse.up()

    def get_map_layers(self) -> str:
        """Get the total number of heatmap layers"""
        self.wait_for_map_loading()
        layers = execute_map_js(self.page, 'getMapLayers', self.map_id)
        return str(layers)

    def get_layer_id_from_test_props(
        self, layer_function_name: str, is_map_loading: bool = True
    ) -> str:
        """Get specific layer id"""
        if is_map_loading:
            self.wait_for_map_loading()
        else:
            self.page.wait_for_timeout(1000)
        layer_id = execute_map_js(self.page, layer_function_name, self.map_id)
        return str(layer_id)

    def get_AU_Marine_Parks_Layer_id(self) -> str:
        """Get the Australian Marine Parks layer id"""
        return self.get_layer_id_from_test_props('getAUMarineParksLayer')

    def get_World_Boundaries_Layer_id(self) -> str:
        """Get the World Boundaries layer id"""
        return self.get_layer_id_from_test_props('getWorldBoundariesLayer')

    def get_Spider_Layer_id(self) -> str:
        """Get the Spider layer id"""
        return self.get_layer_id_from_test_props('getSpiderLayer')

    def get_Geo_Server_Layer_id(self) -> str:
        """Get the Geoserver layer id"""
        return self.get_layer_id_from_test_props(
            'getGeoServerLayer', is_map_loading=False
        )

    def get_Hex_Grid_Layer_id(self) -> str:
        """Get the Hex Grid layer id"""
        return self.get_layer_id_from_test_props(
            'getHexbinLayer', is_map_loading=False
        )

    def is_map_layer_visible(
        self, layer_id: str, is_map_loading: bool = True
    ) -> bool:
        """Check whether a given map layer is visible"""
        if is_map_loading:
            self.wait_for_map_loading()
        is_visible = execute_map_js(
            self.page, 'isMapLayerVisible', self.map_id, layer_id
        )
        return is_visible

    def zoom_to_level(self, zoom_level: float = random.uniform(4, 6)) -> None:
        """
        Zoom the map to a specified zoom level.  If not specified, a random zoom level between 4 and 6 will be applied.

        Args:
            zoom_level (float, optional): The zoom level to set the map to. Defaults to random.uniform(4, 6).
        """
        self.wait_for_map_loading()
        execute_map_js(self.page, 'zoomToLevel', self.map_id, zoom_level)

    def get_map_center(self) -> dict:
        """Get the current center coordinates of the map"""
        map_center = execute_map_js(self.page, 'getMapCenter', self.map_id)
        return dict(map_center)

    def get_map_zoom(self) -> float:
        """Get the current zoom level of the map"""
        map_zoom = execute_map_js(self.page, 'getMapZoom', self.map_id)
        return float(map_zoom)

    def find_and_click_cluster(self) -> bool:
        """Find and click on a cluster on the map"""
        return execute_map_js(self.page, 'findAndClickCluster', self.map_id)

    def get_map_click_lng_lat(self) -> dict:
        """Get the lnglat of the last clicked point on the map"""
        click_coordinate = execute_map_js(
            self.page, 'getMapClickLngLat', self.map_id
        )
        return dict(click_coordinate)

    def find_and_click_data_point(self, uuid: str) -> bool:
        """Find and click on a data point on the map"""
        return execute_map_js(
            self.page, 'findAndClickDataPoint', self.map_id, uuid
        )

from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.js_scripts.js_utils import execute_js, load_js_functions


class Map(BasePage):
    def __init__(self, page: Page):
        self.page = page
        load_js_functions(page)

        self.basemap_show_hide_menu = page.get_by_label(
            'basemap-show-hide-menu'
        )

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
        # Inject JavaScript to center map to a data point
        execute_js(self.page, 'centerMap', lng, lat, '12')

        # Wait for map to be loaded
        self.wait_for_map_loading()

    def wait_for_map_loading(self) -> None:
        """Wait until the map is in a loaded state"""
        self.page.wait_for_function('() => {return isMapLoaded();}')

    def click_map(self) -> None:
        """Click the map at the current position of the mouse"""
        self.page.mouse.down()
        self.page.mouse.up()

    def get_map_layers(self) -> str:
        """Get the number of map layers"""
        self.wait_for_map_loading()
        layers = execute_js(self.page, 'getMapLayers')
        return str(layers)

    def is_map_layer_visible(self, layer_id: str) -> bool:
        """Check whether a given map layer is visible or not"""
        self.wait_for_map_loading()
        is_visible = execute_js(self.page, 'isMapLayerVisible', layer_id)
        return is_visible

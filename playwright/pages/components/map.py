from playwright.sync_api import Page

from pages.base_page import BasePage


class Map(BasePage):
    def __init__(self, page: Page):
        self.page = page

        self.basemap_show_hide_menu = page.get_by_label(
            'basemap-show-hide-menu'
        )

    def hover_map(self) -> None:
        self.page.get_by_label('Map', exact=True).hover()

    def drag_map(self) -> None:
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
        # Inject JavaScript to center map to a data point
        script = f"""
            const map = document.MAP_OBJECT;
            map.setZoom(12);
            map.setCenter([{lng}, {lat}]);
        """
        self.page.evaluate(script)

        # Wait for map to be loaded
        self.wait_for_map_loading()

    def wait_for_map_loading(self) -> None:
        self.page.wait_for_function(
            """
            () => {
                const map = document.MAP_OBJECT;
                return map.loaded();
            }
        """,
            timeout=2000,
        )

    def click_map_data_point(self) -> None:
        self.page.mouse.down()
        self.page.mouse.up()

    def get_map_layers(self) -> str:
        self.wait_for_map_loading()
        layers = self.page.evaluate(
            """() => {
                const layer = 'heatmap-layer-map-container-id-heatmap-layer';
                return document.MAP_OBJECT.queryRenderedFeatures({layers: [layer]}).length;
            }"""
        )
        return str(layers)

    def is_layer_visible(self, layer_id: str) -> bool:
        self.wait_for_map_loading()
        is_visible = self.page.evaluate(
            f"""() => {{
                return undefined != document.MAP_OBJECT.getLayer('{layer_id}');
            }}"""
        )
        return is_visible

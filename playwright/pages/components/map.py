from playwright.sync_api import Page

from pages.base_page import BasePage


class Map(BasePage):
    def __init__(self, page: Page):
        self.page = page

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
            const map = document.testMap;
            map.setZoom(6);
            map.setCenter([{lng}, {lat}]);
        """
        self.page.evaluate(script)

        # Wait for map to be loaded
        self.wait_for_map_loading()

    def wait_for_map_loading(self) -> None:
        self.page.wait_for_function(
            """
            () => {
                const map = document.testMap;
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
                const layer = 'heatmap-layer-map-container-id-heatmap';
                return document.testMap.queryRenderedFeatures({layers: [layer]}).length;
            }"""
        )
        return str(layers)

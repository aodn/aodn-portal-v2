from core.enums.layer_type import LayerType
from pages.components.map import Map


class LayerFactory:
    def __init__(self, map: Map):
        self.map = map

    def get_layer_id(self, layer_type: LayerType) -> str:
        if layer_type == LayerType.MARINE_PARKS:
            return self.map.get_AU_Marine_Parks_Layer_id()
        elif layer_type == LayerType.WORLD_BOUNDARIES:
            return self.map.get_World_Boundaries_Layer_id()
        elif layer_type == LayerType.SPIDER:
            return self.map.get_Spider_Layer_id()
        elif layer_type == LayerType.GEO_SERVER:
            return self.map.get_Geo_Server_Layer_id()
        elif layer_type == LayerType.HEX_GRID:
            return self.map.get_Hex_Grid_Layer_id()
        elif layer_type == LayerType.SPATIAL_EXTENT:
            return self.map.get_Spatial_Extent_Layer_id()

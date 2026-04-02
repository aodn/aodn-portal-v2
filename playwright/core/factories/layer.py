from typing import Union

from core.enums.map_layers.layer_style import LayerStyle
from core.enums.map_layers.reference_layer import ReferenceLayer
from pages.components.map import Map


class LayerFactory:
    def __init__(self, map: Map):
        self.map = map

    def get_layer_id(
        self, layer_type: Union[LayerStyle, ReferenceLayer]
    ) -> str:
        if layer_type == ReferenceLayer.ALLEN_CORAL_ATLAS:
            return self.map.get_Allen_Coral_Atlas_Layer_id()
        elif layer_type == ReferenceLayer.MARINE_PARKS:
            return self.map.get_AU_Marine_Parks_Layer_id()
        elif layer_type == ReferenceLayer.MARINE_ECOREGION:
            return self.map.get_Marine_Ecoregion_Layer_id()
        elif layer_type == ReferenceLayer.WORLD_BOUNDARIES:
            return self.map.get_World_Boundaries_Layer_id()
        elif layer_type == LayerStyle.SPIDER:
            return self.map.get_Spider_Layer_id()
        elif layer_type == LayerStyle.GEO_SERVER:
            return self.map.get_Geo_Server_Layer_id()
        elif layer_type == LayerStyle.HEX_GRID:
            return self.map.get_Hex_Grid_Layer_id()
        elif layer_type == LayerStyle.SPATIAL_EXTENT:
            return self.map.get_Spatial_Extent_Layer_id()
        else:
            raise ValueError('Invalid Layer type value.')

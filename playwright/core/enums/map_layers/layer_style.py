from enum import Enum, auto


class LayerStyle(Enum):
    CLUSTERED = auto()
    UNCLUSTERED = auto()
    HEAT_MAP = auto()
    SPIDER = auto()
    GEO_SERVER = auto()
    # PMTiles density (UI label "Data Density"); replaced legacy Hex Grid / deck.gl hexbin
    DATA_DENSITY = auto()
    SPATIAL_EXTENT = auto()

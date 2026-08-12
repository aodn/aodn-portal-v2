from enum import Enum, auto


class LayerStyle(Enum):
    CLUSTERED = auto()
    UNCLUSTERED = auto()
    HEAT_MAP = auto()
    SPIDER = auto()
    GEO_SERVER = auto()
    # PMTiles density (UI label "Data Density")
    DATA_DENSITY = auto()
    SPATIAL_EXTENT = auto()
    # Gridded Zarr raster tiles (UI label "Gridded Data")
    GRIDDED_RASTER = auto()

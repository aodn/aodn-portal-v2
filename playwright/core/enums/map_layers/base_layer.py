from enum import Enum, auto


class BaseLayer(Enum):
    STREET_MAP = auto()
    TOPOGRAPHIC_MAP = auto()
    SATELLITE_MAP = auto()
    WORLD_IMAGERY = auto()

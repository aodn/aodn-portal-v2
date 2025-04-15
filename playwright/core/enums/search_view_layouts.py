from enum import Enum


class SearchViewLayouts(Enum):
    LIST = ('List and Map', 'LIST')
    GRID = ('Grid and Map', 'GRID')
    MAP = ('Full Map View', 'MAP')
    FULL_LIST = ('Full List View', 'FULL_LIST')

    @property
    def display_name(self) -> str:
        return self.value[0]

    @property
    def test_id(self) -> str:
        return self.value[1]

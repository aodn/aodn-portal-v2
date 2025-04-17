from enum import Enum


class SearchSortType(Enum):
    TITLE = ('Title', 'TITLE')
    POPULARITY = ('Popularity', 'POPULARITY')
    MODIFIED = ('Modified', 'MODIFIED')

    @property
    def display_name(self) -> str:
        return self.value[0]

    @property
    def test_id(self) -> str:
        return self.value[1]

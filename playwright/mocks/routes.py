PREFIX = '*/**/api/v1/ogc'


class Routes:
    CATEGORY = f'{PREFIX}/ext/parameter/categories'
    AUTOCOMPLETE = f'{PREFIX}/ext/autocomplete?*'
    COLLECTION_BBOX = f'{PREFIX}/collections?properties=id,bbox&*'
    COLLECTION_ALL = (
        f'{PREFIX}/collections?properties=id,title,description,status,links&*'
    )
    COLLECTION_POPUP = (
        f'{PREFIX}/collections?properties=title,description&filter=id*'
    )
    COLLECTION_SELECTED = (
        f'{PREFIX}/collections?properties=id,title,description&filter=id*'
    )

PREFIX = '*/**/api/v1/ogc'


class Routes:
    CATEGORY = f'{PREFIX}/ext/parameter/categories'
    AUTOCOMPLETE = f'{PREFIX}/ext/autocomplete?*'
    VOCABS = f'{PREFIX}/ext/parameter/vocabs'
    COLLECTION_TEMPORAL = f'{PREFIX}/collections?properties=id,temporal&*'
    COLLECTION_PROVIDER = f'{PREFIX}/collections?properties=id,providers&*'
    COLLECTION_CENTROID = f'{PREFIX}/collections?properties=id,centroid&*'
    COLLECTION_ALL = f'{PREFIX}/collections?properties=id,title,description,status,scope,ai_update_frequency,links,assets_summary,bbox&*'
    COLLECTION_POPUP = (
        f'{PREFIX}/collections?properties=title,description&filter=id*'
    )
    COLLECTION_SELECTED = (
        f'{PREFIX}/collections?properties=id,title,description&filter=id*'
    )
    COLLECTION_DETAIL = f'{PREFIX}/collections/*'
    COLLECTION_DETAIL_SUMMARY = f'{PREFIX}/collections/*/items/summary'

    WMS_MAP_TILE = '*/**/items/wms_map_tile?*'
    WMS_MAP_LAYERS = '*/**/items/wms_layers?*'
    WMS_MAP_FIELDS = '*/**/items/wms_fields?*'
    WMS_MAP_FEATURE = '*/**/items/wms_map_feature?*'

    DOWNLOAD_DIALOG = f'{PREFIX}/processes/download/execution'
    DOWNLOAD_WFS = f'{PREFIX}/processes/downloadWfs/execution'

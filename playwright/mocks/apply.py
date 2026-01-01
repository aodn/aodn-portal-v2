from playwright.sync_api import Page

from mocks.api.autocomplete import handle_search_autocomplete_api
from mocks.api.categories import handle_categories_api
from mocks.api.collection_detail import (
    handle_detail_api,
    handle_detail_item_api,
)
from mocks.api.collections import (
    handle_collections_all_api,
    handle_collections_centroid_api,
    handle_collections_popup_api,
)
from mocks.api.search_collections import (
    handle_provider_api,
    handle_temporal_api,
)
from mocks.api.vocabs import handle_vocabs_api
from mocks.api.wms_map import (
    handle_wms_downloadable_fields_api,
    handle_wms_map_tile_api,
    handle_wms_map_layers_api,
)
from mocks.api_router import ApiRouter


def apply_mock(page: Page) -> None:
    api_router = ApiRouter(page)
    api_router.route_category(handle_categories_api)
    api_router.route_autocomplete(handle_search_autocomplete_api)
    api_router.route_vocabs(handle_vocabs_api)
    api_router.route_search_collections(
        handle_temporal_api, handle_provider_api
    )
    api_router.route_collection(
        handle_collections_centroid_api,
        handle_collections_all_api,
        handle_collections_popup_api,
    )
    api_router.route_collection_detail(
        handle_detail_api, handle_detail_item_api
    )
    api_router.route_wms_map_tile(handle_wms_map_tile_api)
    api_router.route_wms_layers(handle_wms_map_layers_api)
    api_router.route_wms_downloadable_fields(handle_wms_downloadable_fields_api)

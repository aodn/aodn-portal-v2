from typing import Generator

import pytest
from playwright.sync_api import Page

from mocks.api.autocomplete import handle_search_autocomplete_api
from mocks.api.categories import handle_categories_api
from mocks.api.collection_detail import handle_detail_api
from mocks.api.collections import (
    handle_collections_all_api,
    handle_collections_bbox_api,
    handle_collections_popup_api,
)
from mocks.api_router import ApiRouter


@pytest.fixture
def page_mock(page: Page) -> Generator:
    api_router = ApiRouter(page)
    api_router.route_category(handle_categories_api)
    api_router.route_autocomplete(handle_search_autocomplete_api)
    api_router.route_collection(
        handle_collections_bbox_api,
        handle_collections_all_api,
        handle_collections_popup_api,
    )
    api_router.route_collection_detail(handle_detail_api)

    yield page

    page.unroute_all()
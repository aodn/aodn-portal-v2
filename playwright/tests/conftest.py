from typing import Generator

import pytest
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
from mocks.api_router import ApiRouter


@pytest.fixture
def page_mock(page: Page) -> Generator:
    api_router = ApiRouter(page)
    api_router.route_category(handle_categories_api)
    api_router.route_autocomplete(handle_search_autocomplete_api)
    api_router.route_collection(
        handle_collections_centroid_api,
        handle_collections_all_api,
        handle_collections_popup_api,
    )
    api_router.route_collection_detail(
        handle_detail_api, handle_detail_item_api
    )

    yield page

    page.unroute_all()


################################################################################
#  Uncomment the following fixtue and run test to record video for test runs.  #
#  Recorded video will be saved in the 'videos' directory.                     #
################################################################################
# @pytest.fixture
# def browser_context_args(browser_context_args):
#     """Fixture to configure video recording"""
#     return {
#         **browser_context_args,
#         'record_video_dir': 'videos',
#         'record_video_size': {'width': 1280, 'height': 720},
#     }

from typing import Generator

import pytest
from playwright.sync_api import Page

from mocks.api.autocomplete import handle_search_autocomplete_api
from mocks.api.categories import handle_categories_api
from mocks.api.collections import handle_collections_api


@pytest.fixture
def page_mock(page: Page) -> Generator:
    PREFIX = '*/**/api/v1/ogc'

    page.route(f'{PREFIX}/ext/parameter/categories', handle_categories_api)
    page.route(f'{PREFIX}/ext/autocomplete?*', handle_search_autocomplete_api)
    page.route(f'{PREFIX}/collections?*', handle_collections_api)

    yield page

    page.unroute_all()

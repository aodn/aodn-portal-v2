from typing import Callable, Generator

import pytest
from playwright.sync_api import Browser, BrowserContext, Page, Playwright

from core.dataclasses.device_config import DeviceConfig
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


def get_mobile_config(playwright: Playwright) -> DeviceConfig:
    iphone_se = playwright.devices['iPhone SE']
    return DeviceConfig(
        is_mobile=True,
        viewport={'width': 375, 'height': 667},
        device_config=iphone_se,
    )


def get_desktop_config() -> DeviceConfig:
    return DeviceConfig(
        is_mobile=False, viewport={'width': 1920, 'height': 1080}
    )


def apply_mock(page: Page) -> None:
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


def setup_page(
    playwright: Playwright, device_config: DeviceConfig
) -> tuple[Browser, BrowserContext, Page]:
    browser = playwright.chromium.launch()
    context_kwargs = device_config.device_config or {}
    context = browser.new_context(**context_kwargs)
    context.is_mobile = device_config.is_mobile
    context.viewport = device_config.viewport
    page = context.new_page()
    apply_mock(page)
    return browser, context, page


def create_page_fixture(
    config_factory: Callable[..., DeviceConfig],
) -> Callable:
    def _fixture(playwright: Playwright) -> Generator:
        config = (
            config_factory(playwright)
            if 'playwright' in config_factory.__code__.co_varnames
            else config_factory()
        )
        browser, context, page = setup_page(playwright, config)

        yield page

        page.unroute_all()
        context.close()
        browser.close()

    return _fixture


@pytest.fixture
def desktop_page(playwright: Playwright) -> Generator:
    yield from create_page_fixture(get_desktop_config)(playwright)


@pytest.fixture
def mobile_page(playwright: Playwright) -> Generator:
    yield from create_page_fixture(get_mobile_config)(playwright)


@pytest.fixture(params=['desktop', 'mobile'])
def responsive_page(
    request: pytest.FixtureRequest, playwright: Playwright
) -> Generator:
    config_factory = (
        get_desktop_config if request.param == 'desktop' else get_mobile_config
    )
    yield from create_page_fixture(config_factory)(playwright)


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

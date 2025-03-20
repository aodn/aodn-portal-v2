import os
from typing import Any, Callable, Generator

import pytest
from playwright.sync_api import Browser, BrowserContext, Page, Playwright

from core.dataclasses.device_config import DeviceConfig
from core.factories.device_configs import get_desktop_config, get_mobile_config
from mocks.apply import apply_mock
from utils.trace_utils import get_trace_dir_path


def setup_page(
    playwright: Playwright, device_config: DeviceConfig
) -> tuple[Browser, BrowserContext, Page]:
    browser = playwright.chromium.launch()
    context_kwargs = device_config.device_config or {}
    context = browser.new_context(**context_kwargs)
    if hasattr(context, 'is_mobile'):
        context.is_mobile = device_config.is_mobile
    if hasattr(context, 'viewport'):
        context.viewport = device_config.viewport
    page = context.new_page()
    apply_mock(page)
    return browser, context, page


def create_page_fixture(
    config_factory: Any,
) -> Callable:
    def _fixture(
        playwright: Playwright, request: pytest.FixtureRequest
    ) -> Generator:
        config = (
            config_factory(playwright)
            if 'playwright' in config_factory.__code__.co_varnames
            else config_factory()
        )
        browser, context, page = setup_page(playwright, config)

        tracing_mode = request.config.getoption('--tracing')

        # Only start tracing if enabled
        if tracing_mode != 'off':
            context.tracing.start(
                screenshots=True, snapshots=True, sources=True
            )

        yield page

        # After test execution, handle tracing based on mode
        if tracing_mode != 'off':
            trace_dir, filename = get_trace_dir_path(request.node.nodeid)

            trace_path = os.path.join(trace_dir, filename)

            if tracing_mode == 'on':
                context.tracing.stop(path=trace_path)
            elif (
                tracing_mode == 'retain-on-failure'
                and request.node.rep_call.failed
            ):
                context.tracing.stop(path=trace_path)

        page.unroute_all()
        context.close()
        browser.close()

    return _fixture


@pytest.fixture
def desktop_page(
    playwright: Playwright, request: pytest.FixtureRequest
) -> Generator:
    """
    Use the desktop_page fixture to run tests on desktop only
    """
    yield from create_page_fixture(get_desktop_config)(playwright, request)


@pytest.fixture
def mobile_page(
    playwright: Playwright, request: pytest.FixtureRequest
) -> Generator:
    """
    Use the mobile_page fixture to run tests on mobile only
    """
    yield from create_page_fixture(get_mobile_config)(playwright, request)


@pytest.fixture(params=['desktop', 'mobile'])
def responsive_page(
    request: pytest.FixtureRequest, playwright: Playwright
) -> Generator:
    """
    Use the responsive_page fixture to run tests on both desktop and mobile
    """
    config_factory = (
        get_desktop_config if request.param == 'desktop' else get_mobile_config
    )
    yield from create_page_fixture(config_factory)(playwright, request)

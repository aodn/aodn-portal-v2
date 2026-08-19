import os
from typing import Any, Callable, Generator

import pytest
from playwright.sync_api import Browser, BrowserContext, Page, Playwright

from core.dataclasses.device_config import DeviceConfig
from core.factories.device_configs import get_desktop_config, get_mobile_config
from mocks.apply import apply_mock
from utils.trace_utils import get_trace_dir_path

# CI/headless Chromium has no GPU. Opt into SwiftShader so Chromium does not
# log the deprecated automatic software-WebGL fallback warning.
_SWIFTSHADER_LAUNCH_ARGS = (
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
)

# Chromium still emits these on software GL; they are not test failures.
_IGNORED_CONSOLE_FRAGMENTS = (
    'Automatic fallback to software WebGL has been deprecated',
    'GL Driver Message',
    'GPU stall due to ReadPixels',
    'GroupMarkerNotSet',
)


def _merge_launch_args(browser_type_launch_args: dict) -> dict:
    launch_args = list(browser_type_launch_args.get('args') or [])
    for flag in _SWIFTSHADER_LAUNCH_ARGS:
        if flag not in launch_args:
            launch_args.append(flag)
    return {**browser_type_launch_args, 'args': launch_args}


def _should_print_console(text: str) -> bool:
    return not any(fragment in text for fragment in _IGNORED_CONSOLE_FRAGMENTS)


def setup_page(
    playwright: Playwright,
    device_config: DeviceConfig,
    browser_type_launch_args: dict,
) -> tuple[Browser, BrowserContext, Page]:
    # Use the browser launch args that include --headed flag
    browser = playwright.chromium.launch(
        **_merge_launch_args(browser_type_launch_args)
    )
    context_kwargs = device_config.device_config or {}

    # If the device config doesn't specify a viewport, use the one from the device configuration
    if device_config.viewport and 'viewport' not in context_kwargs:
        context_kwargs = {**context_kwargs, 'viewport': device_config.viewport}

    # Create a new browser context with the device configuration
    context = browser.new_context(**context_kwargs)
    page = context.new_page()
    page.on(
        'console',
        lambda msg: (
            print(f'[BROWSER CONSOLE] {msg.text}')
            if _should_print_console(msg.text)
            else None
        ),
    )
    apply_mock(page)
    return browser, context, page


def create_page_fixture(
    config_factory: Any,
) -> Callable:
    def _fixture(
        playwright: Playwright,
        request: pytest.FixtureRequest,
        browser_type_launch_args: dict,
    ) -> Generator:
        config = (
            config_factory(playwright)
            if 'playwright' in config_factory.__code__.co_varnames
            else config_factory()
        )
        browser, context, page = setup_page(
            playwright, config, browser_type_launch_args
        )

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
    playwright: Playwright,
    request: pytest.FixtureRequest,
    browser_type_launch_args: dict,
) -> Generator:
    """
    Use the desktop_page fixture to run tests on desktop only
    """
    yield from create_page_fixture(get_desktop_config)(
        playwright, request, browser_type_launch_args
    )


@pytest.fixture
def mobile_page(
    playwright: Playwright,
    request: pytest.FixtureRequest,
    browser_type_launch_args: dict,
) -> Generator:
    """
    Use the mobile_page fixture to run tests on mobile only
    """
    yield from create_page_fixture(get_mobile_config)(
        playwright, request, browser_type_launch_args
    )


@pytest.fixture(params=['desktop', 'mobile'])
def responsive_page(
    request: pytest.FixtureRequest,
    playwright: Playwright,
    browser_type_launch_args: dict,
) -> Generator:
    """
    Use the responsive_page fixture to run tests on both desktop and mobile
    """
    config_factory = (
        get_desktop_config if request.param == 'desktop' else get_mobile_config
    )
    yield from create_page_fixture(config_factory)(
        playwright, request, browser_type_launch_args
    )

import os
from datetime import datetime
from typing import Any

import pytest
from _pytest.nodes import Item
from _pytest.runner import CallInfo


@pytest.fixture(scope='session', autouse=True)
def change_test_dir(request: pytest.FixtureRequest) -> None:
    """
    Fixture to set the working directory to the project's root for the entire test session.
    This ensures that relative file paths in the tests are resolved correctly.

    Parameters:
    request (FixtureRequest): Provides access to the test context.

    Note:
    If the pytest command is run from a different directory, specify the root directory using
    the `--rootdir` command-line option. Example: `pytest --rootdir=playwright`.
    """
    os.chdir(request.config.__getattribute__('rootdir'))


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item: Item, call: CallInfo[Any]) -> Any:
    """Hook to handle test results and capture screenshots on failure"""

    pytest_html = item.config.pluginmanager.getplugin('html')

    outcome = yield
    report = outcome.get_result()

    # Only handle failures during the test call phase
    if report.when == 'call' and report.failed:
        try:
            page = None
            if hasattr(item, 'funcargs'):
                # Look for any of the page fixtures
                for page_fixture in [
                    'page',
                    'desktop_page',
                    'mobile_page',
                    'responsive_page',
                ]:
                    if page_fixture in item.funcargs:
                        page = item.funcargs.get(page_fixture)
                        break
            if page:
                # Create screenshots directory if it doesn't exist
                screenshots_dir = 'reports/screenshots'

                # Generate unique screenshot filename
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                screenshot_name = f'failure_{item.name}_{timestamp}.png'
                screenshot_path = os.path.join(screenshots_dir, screenshot_name)

                # Capture screenshot
                page.screenshot(path=screenshot_path)

                # Add the screenshot to the HTML report
                extra = getattr(report, 'extra', [])
                if not extra:
                    report.extras = []
                report.extras.append(
                    pytest_html.extras.image(f'screenshots/{screenshot_name}')
                )
                report.extras.append(
                    pytest_html.extras.html(
                        f'<div>Screenshot saved as {screenshot_name}</div>'
                    )
                )

        except Exception as e:
            print(f'Failed to capture screenshot: {e}')

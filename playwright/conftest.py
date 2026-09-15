import os

import pytest
from playwright.sync_api import expect

# Playwright's 5s default assumed every route was already in the entry bundle:
# a deferred module script makes DOMContentLoaded wait for it, so a page object
# could navigate and assert on the first element straight away.
#
# The routes are code-split now, so they arrive through dynamic imports that
# DOMContentLoaded does not wait for, and the assertion has to cover fetching
# and evaluating the route chunk. Against the dev server that is a cold Vite
# transform. Locally the worst observed wait was 2.2s, but CI runs the same
# suite at the same parallelism in 986s against 484s here, so the same work
# lands around 4.5s there -- close enough to 5s that the heaviest page loads
# lose the race and fail reproducibly.
EXPECT_TIMEOUT_MS = 15 * 1000


@pytest.fixture(scope='session', autouse=True)
def set_expect_timeout() -> None:
    """Widen the default assertion timeout to cover code-split route loads."""
    expect.set_options(timeout=EXPECT_TIMEOUT_MS)


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

# conftest.py
import os

import pytest


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

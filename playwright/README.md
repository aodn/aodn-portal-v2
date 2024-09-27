# Pytest Playwright UI Tests

This is a suite of automated end-to-end UI tests for the AODN Portal v2. The tests are implemented using [pytest](https://pytest.org/) framework and [Playwright](https://playwright.dev/python/) for interactions with the web browser.

## Execute Tests Using Docker

1. **Prerequisites**: _Docker_ installed on your system.
2. Run playwright tests against the current local version of the aodn-portal-v2:

   ```bash
   yarn playwright
   ```

## Setup Guide for Local Development of the Test Suite:

### Python version:

Python 3.10.x is required. **UNIX/MacOS** users can use [Pyenv](https://github.com/pyenv/pyenv) for Python version management.

However, This guide provides instructions for setting up your working environment using [Conda](https://conda.io/projects/conda/en/latest/user-guide/install/index.html) to create a virtual [environment](https://docs.conda.io/projects/conda/en/latest/user-guide/concepts/environments.html) with the required Python version that should work on both **UNIX/MacOS** and **Windows**. Additionally, we'll utilize [Poetry](https://python-poetry.org/docs/) to manage packages within the `conda` environment.

## Installation:

If you don't have `Conda` and `Poetry` installed, you'll need to install them before setting up the project.

> _`Poetry` should be installed globally on your system, not within a Python virtual environment. We will utilize `pipx` to ensure that `Poetry` remains isolated in the global scope while also being accessible from anywhere on your system._

### Conda

To install `Conda`, please refer to the [official guide](https://conda.io/projects/conda/en/latest/user-guide/install/index.html).

### Poetry

1. First, install `pipx` by following the instructions in the [official repository](https://github.com/pypa/pipx). Ensure that `pipx` is added to your system's PATH variable after installation.
2. For **OSX** and **Z Shell** users, open up `~/.zshrc` and add this:

   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   ```

3. Then, proceed to install `Poetry` by running the following command:

   ```bash
   pipx install poetry
   ```

## Project Setup:

1. Open your terminal (Linux, MacOS) or the Miniconda/Anaconda Prompt (Windows).
2. Navigate to the `/playwright` directory.
3. Create a `conda` environment using the `environment.yml` file:

   ```bash
   conda env create -f environment.yml
   ```

   > This command creates a virtual environment with the name `aodn-portal-v2` and installs the required python version.

4. Activate this `conda` environment:
   ```bash
   conda activate aodn-portal-v2
   ```
5. Install dependencies defined in `pyproject.toml`:
   ```bash
   poetry install
   ```
6. Install all supported browsers with system dependencies:
   ```bash
   playwright install --with-deps
   ```
7. Configure project related settings:

   a) Open the `settings.toml` file

   b) Update the required values according to your environment.

## Running Tests:

1. Run all tests:
   ```bash
   pytest
   ```
2. Run tests with visible browsers

   ```bash
   pytest --headed
   ```

3. To run tests in parallel, use the `--numprocesses` flag:
   ```bash
   pytest --numprocesses auto
   ```
   More configurable options can be found in the [official documentation](https://playwright.dev/python/docs/running-tests).

## Test Report:

Test reports are generated using [pytest-html](https://pytest-html.readthedocs.io/en/latest/). The generated report for the _latest_ test run will be stored inside the `/playwright/reports` directory.

## Debug on VSCode

Install https://playwright.dev/docs/getting-started-vscode Playwright Test for VSCode

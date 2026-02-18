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
   # If this command still fail with dependency lib, you may need to upgrade your lib or playwright version
   playwright install --with-deps
   ```

7. Configure project related settings:

   a) Open the `settings.toml` file

   b) Update the required values according to your environment.

## Running Tests:

1. Run all tests:
   ```bash
   # If you run locally, make sure you run "yarn playwright-local" to start the local server before running the tests.
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

4. Run a single test multiple times:

   ```bash
   pytest -k test_function_name --count=10
   ```

   Here, `-k` selects the test by name, and `--count` runs it the specified number of times.

5. Run the same test multiple times in parallel:

   ```bash
   pytest -k test_function_name --count=5 -n 5
   ```

   Here, `--count=5` creates 5 instances of the test, and `-n 5` distributes them across 5 parallel workers.

## Test Results & Debugging Failed Tests

After a test run, two types of documentation are generated to help analyze results:

1. **HTML Report**: A user-friendly summary of test outcomes.
2. **Playwright Traces**: Detailed step-by-step traces for failed tests.

### Local Development

- **HTML Report**: Saved under the `reports` directory at the root of the playwright test framework project.
- **Playwright Traces**: Saved under the `test-results` directory.

To record traces during local test runs, use the `--tracing` option with `pytest`. Available options:

- `on`: Record and save traces for every test.
- `retain-on-failure`: Only save traces for failed tests.
- `off`: Do not record trace. (default).

Example usage:

```bash
pytest --tracing retain-on-failure
```

### GitHub Actions Workflow

In CI runs, traces are automatically saved for failed tests.

- Navigate to the specific workflow run.
- Scroll down to the **Artifacts** section.
- Download the artifact named `test-report`.
- After extracting the zip file:
  - `reports/`: Contains the HTML test report.
  - `test-results/`: Contains trace files for failed tests, structured by folder just like the [`tests/`](./tests/) directory.

### How to Investigate Failed Tests

Refer to [this link](https://github.com/aodn/aodn-portal-v2/issues/374) that contains the details on how to investigate a failed test.

## Debug on VSCode

Install https://playwright.dev/docs/getting-started-vscode Playwright Test for VSCode

import os
import re


def get_trace_dir_path(nodeid: str) -> tuple[str, str]:
    """
    Generate trace directory path and filename based on the test's nodeid.

    Args:
        nodeid: The pytest nodeid of the test

    Returns:
        tuple containing directory path and filename
    """
    # Create subdirectories for test file paths
    parts = nodeid.split('::')
    test_file = parts[0].replace(
        '/', os.sep
    )  # Handle path separators across OS
    test_file_name = os.path.basename(test_file)
    test_name = parts[1]

    # Extract directory structure from test file path
    test_dir = os.path.dirname(test_file)

    trace_dir = os.path.join('test-results', test_dir, test_file_name)

    filename = get_valid_filename(f'{test_name}.zip')

    return trace_dir, filename


def get_valid_filename(name: str) -> str:
    # Truncate test name if it exceeds 100 characters
    truncated = (
        name if len(name) <= 100 else f'{name[:50]}{"." * 10}{name[-30:]}'
    )
    # Define the set of invalid characters
    invalid_chars = r'[<>:"/\\|?*]'
    # Replace invalid characters with hyphens
    filename = re.sub(invalid_chars, '-', truncated)

    return filename

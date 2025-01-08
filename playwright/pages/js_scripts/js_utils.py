import os
from typing import Any, Optional

from playwright.sync_api import Page

# Constants for JavaScript namespaces
MAP_JS_NAMESPACE = 'window.__map_functions'
COMMON_JS_NAMESPACE = 'window.__common_functions'
DEFAULT_TIMEOUT = 30000  # 30 seconds in milliseconds


def load_js_functions(page: Page, js_file_name: str) -> None:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    js_file_path = os.path.join(current_dir, js_file_name)
    with open(js_file_path, 'r', encoding='utf-8') as file:
        js_code = file.read()
        page.add_init_script(js_code)


def load_map_js_functions(page: Page) -> None:
    load_js_functions(page, 'map_functions.js')


def load_common_js_functions(page: Page) -> None:
    load_js_functions(page, 'common_functions.js')


def execute_map_js(page: Page, func_name: str, *args: Any) -> Any:
    args_str = ', '.join(map(repr, args))
    script = f'{MAP_JS_NAMESPACE}.{func_name}({args_str});'
    return page.evaluate(script)


def execute_common_js(page: Page, func_name: str, *args: Any) -> Any:
    args_str = ', '.join(map(repr, args))
    script = f'{COMMON_JS_NAMESPACE}.{func_name}({args_str});'
    return page.evaluate(script)


def wait_for_js_function(
    page: Page, func_name: str, timeout: Optional[float] = DEFAULT_TIMEOUT
) -> Any:
    """
    Wait for a JavaScript function to return true.

    Args:
        page: Playwright Page object
        func_name: Name of the function to wait for
        timeout: Optional timeout in milliseconds (defaults to 30 seconds)
    """
    script = f'() => {{return {MAP_JS_NAMESPACE}.{func_name}();}}'
    return page.wait_for_function(script, timeout=timeout)

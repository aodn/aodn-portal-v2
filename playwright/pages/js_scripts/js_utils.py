import os
from typing import Any

from playwright.sync_api import Page


def load_js_functions(page: Page) -> None:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    js_file_path = os.path.join(current_dir, 'map_functions.js')
    with open(js_file_path, 'r') as file:
        js_code = file.read()
        page.add_init_script(js_code)


def execute_js(page: Page, func_name: str, *args: Any) -> Any:
    args_str = ', '.join(map(repr, args))
    script = f'{func_name}({args_str});'
    return page.evaluate(script)

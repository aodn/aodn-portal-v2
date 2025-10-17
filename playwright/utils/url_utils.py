from typing import List
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import Route


def get_query_params(route: Route, param_name: str) -> List[str]:
    """
    Extracts the given query parameter from a Playwright Route request URL.

    Args:
        route (Route): The intercepted Playwright route containing the request URL.
        param_name (str): The name of the query parameter to extract.

    Returns:
        List[str]: A list of query parameter values for the given parameter name, or an empty list if not present.
    """
    query_string = urlparse(route.request.url).query
    params = parse_qs(query_string)
    return params.get(param_name, [])

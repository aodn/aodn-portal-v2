import json
from typing import Any


def load_json_data(file_name: str) -> Any:
    """
    Load JSON data from a file.

    Args:
        file_name (str): The name of the JSON file.

    Returns:
        Any: The JSON data loaded from the file.
    """
    with open(f'mocks/mock_data/{file_name}', 'r') as file:
        return json.load(file)


def filter_collection_by_id(data: Any, collection_id: str) -> Any:
    matching_collection = next(
        (coll for coll in data['collections'] if coll['id'] == collection_id),
        None,
    )

    if matching_collection:
        filtered_data = {
            'links': [],
            'collections': [
                {
                    'properties': {},
                    'title': matching_collection['title'],
                    'description': matching_collection['description'],
                    'links': [],
                    'itemType': matching_collection['itemType'],
                }
            ],
        }
        return filtered_data
    else:
        return None

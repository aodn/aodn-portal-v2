import os
from datetime import datetime, timezone
from json import JSONDecodeError
from typing import Any, Dict, List

from playwright.sync_api import Route

from utils.json_utils import load_json_data


def handle_sort_by_relevance(route: Route) -> None:
    json_data = load_json_data('sorted_by_relevance.json')
    route.fulfill(json=json_data)


def handle_sort_by_title(route: Route) -> None:
    json_data = load_json_data('sorted_by_relevance.json')
    json_data['collections'].sort(key=lambda x: x['title'])
    route.fulfill(json=json_data)


def handle_sort_by_modified(route: Route) -> None:
    json_data = load_json_data('sorted_by_relevance.json')
    sorted_json = sort_collections_by_temporal_end(json_data)
    route.fulfill(json=sorted_json)


def get_latest_end_date(temporal_data: List[Dict[str, Any]]) -> datetime:
    """Extracts the latest 'end' date from the 'temporal' array.
    If no 'end' date is available, returns the current time."""
    current_time = datetime.now(timezone.utc)
    end_dates = []

    # Collect valid 'end' dates
    for period in temporal_data:
        if 'end' in period and period['end']:
            end_dates.append(
                datetime.fromisoformat(period['end'].replace('Z', '+00:00'))
            )

    # Return the latest date, or current time if none are available
    return max(end_dates, default=current_time)


def sort_collections_by_temporal_end(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sorts the collections based on the 'temporal'->'end' date in corresponding JSON files."""

    # Helper to fetch temporal end date from corresponding file
    def fetch_temporal_end_date(collection: Dict[str, Any]) -> datetime:
        collection_id = collection['id']
        json_file_path = os.path.join('dataset_detail', f'{collection_id}.json')

        # Load corresponding JSON data
        try:
            file_data = load_json_data(json_file_path)
            temporal_data = file_data.get('properties', {}).get('temporal', [])
            return get_latest_end_date(temporal_data)
        except JSONDecodeError as error:
            raise ValueError(
                f'The file contains invalid JSON data: {json_file_path}'
            ) from error

    # Sort collections based on the temporal end date from the corresponding file
    data['collections'].sort(key=fetch_temporal_end_date, reverse=True)
    return data

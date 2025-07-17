from dataclasses import dataclass
from typing import List, Optional


@dataclass
class SearchFilterConfig:
    """Configuration for expected search filter parameters."""

    # Date filters
    date_time_start: Optional[str] = None
    date_time_end: Optional[str] = None

    # Spatial filter
    location_name: Optional[str] = None

    # Parameter filters
    parameter_vocab_labels: Optional[List[str]] = None

    # Platform filters
    platform_vocab_labels: Optional[List[str]] = None

    # Organization/Provider filter
    dataset_provider: Optional[str] = None

    # Update frequency filter
    update_frequency: Optional[str] = None

    # Data availability filter
    download_service_available: bool = False

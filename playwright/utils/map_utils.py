def are_coordinates_equal(coord1: dict, coord2: dict, tolerance: float = 1e-6) -> bool:
    """
    Compare two lat/lng coordinate dictionaries with a tolerance.

    Args:
        coord1: Dictionary with 'lat' and 'lng' keys (e.g., {'lat': -22.4, 'lng': 30.5})
        coord2: Dictionary with 'lat' and 'lng' keys
        tolerance: Maximum allowable difference for lat and lng (default: 1e-6)

    Returns:
        bool: True if coordinates are equal within tolerance, False otherwise
    """
    return (
            abs(coord1['lat'] - coord2['lat']) < tolerance and
            abs(coord1['lng'] - coord2['lng']) < tolerance
    )
from playwright.sync_api import Route


def handle_static_geojson_api(route: Route) -> None:
    # Minimal mock GeoJSON to avoid loading large files during tests
    url = route.request.url
    if 'Australian_Marine_Parks_boundaries.json' in url:
        mock_geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'OBJECTID': 1,
                        'NETNAME': 'South-east',
                        'RESNAME': 'Apollo',
                        'SHAPEAREA': 0.123400848913103,
                        'SHAPELEN': 1.87500000047117,
                    },
                    'geometry': {'type': 'Polygon', 'coordinates': [[]]},
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'OBJECTID': 2,
                        'NETNAME': 'North',
                        'RESNAME': 'Arafura',
                        'SHAPEAREA': 1.8883901150448401,
                        'SHAPELEN': 7.53180271904149,
                    },
                    'geometry': {'type': 'Polygon', 'coordinates': [[]]},
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'OBJECTID': 46,
                        'NETNAME': 'Temperate East',
                        'RESNAME': 'Jervis',
                        'SHAPEAREA': 0.244841801506466,
                        'SHAPELEN': 2.08462689482836,
                    },
                    'geometry': {'type': 'Polygon', 'coordinates': [[]]},
                },
            ],
        }
        route.fulfill(json=mock_geojson)
    elif 'Meow.json' in url:
        # Not yet impl
        mock_geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'ECO_CODE': 20192.0,
                        'ECOREGION': 'Agulhas Bank',
                        'PROV_CODE': 51.0,
                        'PROVINCE': 'Agulhas',
                        'RLM_CODE': 10.0,
                        'REALM': 'Temperate Southern Africa',
                        'ALT_CODE': 189.0,
                        'ECO_CODE_X': 192.0,
                        'Lat_Zone': 'Temperate',
                    },
                    'geometry': {'type': 'Polygon', 'coordinates': [[]]},
                }
            ],
        }
        route.fulfill(json=mock_geojson)
    elif 'Allen_Coral_Atlas.json' in url:
        # Not yet impl
        mock_geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'name': 'boundary',
                        'OBJECTID': 26,
                        'ECOREGION': 'Timor & Arafura Seas',
                    },
                    'geometry': {'type': 'Polygon', 'coordinates': [[]]},
                }
            ],
        }
        route.fulfill(json=mock_geojson)

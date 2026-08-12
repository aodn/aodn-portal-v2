import struct
import zlib

from playwright.sync_api import Route

# UUID whose collection advertises gridded raster tile products.
SUPPORTED_UUID = '27cc65c0-d453-4ba3-a0d6-55e4449fee8c'
# UUID whose collection is catalogued but has no products — a normal 200.
UNSUPPORTED_UUID = '19da2ce7-138f-4427-89de-a50c724f5f54'

# Two visual products with deliberately DIFFERENT sparse date lists: that is
# what proves the slider marks re-derive on product switch rather than
# persisting. The two-variable product carries %2B, which must survive to the
# wire — an unencoded '+' decodes to a space and 400s.
PRODUCT_ONE_ID = 'satellite_net_primary_productivity_gsm_1day_aqua:chl_oc3'
PRODUCT_ONE_DATES = ['2024-01-01', '2024-01-05', '2024-01-09']
PRODUCT_TWO_ID = 'model_currents:ucur+vcur'
PRODUCT_TWO_DATES = ['2023-06-02', '2023-06-03']
DATA_ONLY_PRODUCT_ID = 'model_temperature:temp'


def _tile_template(uuid: str, dataset: str, variable: str) -> str:
    return (
        f'/api/v1/ogc/collections/{uuid}/map/tiles/WebMercatorQuad'
        '/{z}/{x}/{y}'
        f'?dataset={dataset}&variable={variable}'
        '&datetime={datetime}&f=png'
    )


def _products_payload(uuid: str) -> dict:
    return {
        'products': [
            {
                'id': PRODUCT_ONE_ID,
                'variable': 'CHL_OC3',
                'tile_types': ['visual', 'data'],
                'available_dates': PRODUCT_ONE_DATES,
                'full_date_range': {
                    'start': PRODUCT_ONE_DATES[0],
                    'end': PRODUCT_ONE_DATES[-1],
                },
                'visual_tile_url_template': _tile_template(
                    uuid,
                    'satellite_net_primary_productivity_gsm_1day_aqua',
                    'chl_oc3',
                ),
                'legend_url': '/api/v1/ogc/ext/tiles/colormaps/{colormap}/legend',
            },
            {
                'id': PRODUCT_TWO_ID,
                'variable': ['UCUR', 'VCUR'],
                'tile_types': ['visual'],
                'available_dates': PRODUCT_TWO_DATES,
                'visual_tile_url_template': _tile_template(
                    uuid, 'model_currents', 'ucur%2Bvcur'
                ),
            },
            {
                # Data-only: must not appear in the dropdown.
                'id': DATA_ONLY_PRODUCT_ID,
                'variable': 'TEMP',
                'tile_types': ['data'],
                'available_dates': ['2024-01-01'],
                'data_tile_url_template': _tile_template(
                    uuid, 'model_temperature', 'temp'
                ),
            },
        ]
    }


def handle_gridded_tile_products_api(route: Route) -> None:
    uuid = route.request.url.split('/collections/')[-1].split('/')[0]
    print(
        f'[MOCK API] handle_gridded_tile_products_api called for uuid: {uuid}'
    )
    if uuid == UNSUPPORTED_UUID:
        route.fulfill(json={'products': []})
        return
    route.fulfill(json=_products_payload(uuid))


def handle_gridded_tile_products_failure(route: Route) -> None:
    """Simulates a backend outage behind the discovery endpoint."""
    print('[MOCK API] handle_gridded_tile_products_failure called')
    route.fulfill(status=503, body='Service Unavailable')


def _png_chunk(tag: bytes, payload: bytes) -> bytes:
    return (
        struct.pack('>I', len(payload))
        + tag
        + payload
        + struct.pack('>I', zlib.crc32(tag + payload) & 0xFFFFFFFF)
    )


def _build_tile_png(size: int = 256) -> bytes:
    """
    A real `size` x `size` RGBA tile. Mapbox rejects an undersized image for a
    tileSize-256 raster source, so a 1x1 placeholder is not enough.
    """
    header = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    # Each row: filter byte 0, then size opaque mid-grey RGBA pixels.
    row = b'\x00' + (b'\x80\x80\x80\xff' * size)
    return (
        b'\x89PNG\r\n\x1a\n'
        + _png_chunk(b'IHDR', header)
        + _png_chunk(b'IDAT', zlib.compress(row * size))
        + _png_chunk(b'IEND', b'')
    )


_TILE_PNG = _build_tile_png()


def handle_gridded_tile_image_api(route: Route) -> None:
    route.fulfill(status=200, content_type='image/png', body=_TILE_PNG)

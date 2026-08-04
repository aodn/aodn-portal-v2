import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage

# dataset_metadata (PMTiles) and WMS layer list can lag under CI load.
_UI_TIMEOUT_MS = 30_000


@pytest.mark.parametrize(
    'uuid',
    [
        '48cf3cb9-caa9-4633-9baa-8bba3c4d904a',
    ],
)
def test_map_data_density_layer_from_summary(
    desktop_page: Page, uuid: str
) -> None:
    """
    Parquet summary collections expose PMTiles Data Density as the default
    map layer (replaces the legacy deck.gl Hex Grid click-popup flow).

    Hex Grid used summary point features for click aggregation popups. Density
    is now rendered from PMTiles; tile-backed hover popups need S3 tiles and
    are not asserted here. This test verifies the layer switcher instead.
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)
    # GeoServer layer-select spinner is independent of PMTiles support, which
    # only appears after dataset_metadata resolves isSupportPMTiles.
    detail_page.detail_map.wait_for_map_loading()
    detail_page.detail_map.wait_for_layer_select_loading()
    detail_page.detail_map.wait_for_map_idle()

    expect(detail_page.detail_map.layers_menu).to_be_visible(
        timeout=_UI_TIMEOUT_MS
    )
    detail_page.detail_map.layers_menu.click()
    # Data Density mounts only after parquet keys exist in dataset_metadata.
    expect(detail_page.detail_map.data_density_layer).to_be_visible(
        timeout=_UI_TIMEOUT_MS
    )
    expect(detail_page.detail_map.data_density_layer).to_be_checked(
        timeout=_UI_TIMEOUT_MS
    )
    expect(detail_page.detail_map.geoserver_layer).to_be_visible(
        timeout=_UI_TIMEOUT_MS
    )


@pytest.mark.parametrize(
    'uuid, data',
    [
        (
            '27cc65c0-d453-4ba3-a0d6-55e4449fee8c',
            'Latitude: 16936291.45782',
        ),
    ],
)
def test_map_popup_from_feature(
    desktop_page: Page, uuid: str, data: str
) -> None:
    """
    Verifies that clicking on the detail page map opens a popup and displays
    the expected value matching the wms_map_feature API response.

    Test steps:
    - Load detail page for given UUID
    - Perform map click at current view center
    - Check that popup appears and contains the expected text
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    detail_page.detail_map.wait_for_map_loading()
    detail_page.detail_map.wait_for_map_idle()
    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()

    expect(detail_page.detail_map_popup).to_be_visible(timeout=_UI_TIMEOUT_MS)
    expect(detail_page.detail_map_popup).to_contain_text(
        data, timeout=_UI_TIMEOUT_MS
    )

import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid, data_lng, data_lat, data',
    [
        (
            '48cf3cb9-caa9-4633-9baa-8bba3c4d904a',
            '159.018',
            '-29.97',
            'Data Record Count: 372',
        ),
    ],
)
def test_map_popup_from_summary(
    desktop_page: Page, uuid: str, data_lng: str, data_lat: str, data: str
) -> None:
    """
    Verifies that clicking a specific data point on the detail page map opens
    the popup and displays the expected value matching the summary API response.

    Test steps:
    - Load detail page for given UUID
    - Zoom map and center on provided coordinates
    - Click the map at that location
    - Check that popup appears and contains the expected text
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    detail_page.detail_map.wait_for_map_idle()
    detail_page.detail_map.zoom_to_level(9)
    detail_page.detail_map.center_map(data_lng, data_lat)
    detail_page.detail_map.wait_for_map_idle()

    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()

    expect(detail_page.detail_map_popup).to_be_visible()
    expect(detail_page.detail_map_popup).to_contain_text(data)


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

    detail_page.detail_map.wait_for_map_idle()
    detail_page.detail_map.hover_map()
    detail_page.detail_map.click_map()

    expect(detail_page.detail_map_popup).to_be_visible()
    expect(detail_page.detail_map_popup).to_contain_text(data)

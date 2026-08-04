import pytest
from playwright.sync_api import Page, expect

from core.enums.search_view_layouts import SearchViewLayouts
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage

# Map paint / collection fetch can lag under CI load.
_UI_TIMEOUT_MS = 30_000


@pytest.mark.parametrize(
    'data_id, data_lng, data_lat',
    [
        (
            '19da2ce7-138f-4427-89de-a50c724f5f54',
            '135.25',
            '-36.0',
        ),
    ],
)
def test_map_card_popup_download_button_in_desktop(
    desktop_page: Page, data_id: str, data_lng: str, data_lat: str
) -> None:
    """
    Validates that clicking the download button in the map card popup opens the detail page
    and then clicking the return button navigates back to the search page.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.search_for(data_id)
    search_page.wait_for_page_stabilization()
    search_page.map.wait_for_map_idle()

    search_page.map.center_map(data_lng, data_lat)
    search_page.wait_for_page_stabilization()
    search_page.map.wait_for_map_idle()
    search_page.map.hover_map()

    # Hover tip only mounts after features paint; download stays disabled until
    # collection summary links are available.
    popup_download_btn = search_page.map_popup_download_button.last
    expect(popup_download_btn).to_be_visible(timeout=_UI_TIMEOUT_MS)
    expect(popup_download_btn).to_be_enabled(timeout=_UI_TIMEOUT_MS)
    popup_download_btn.click()

    expect(detail_page.return_button).to_be_visible(timeout=_UI_TIMEOUT_MS)
    detail_page.return_button.click()
    expect(search_page.main_map).to_be_visible(timeout=_UI_TIMEOUT_MS)
    search_page.map.wait_for_map_idle()


@pytest.mark.parametrize(
    'data_id',
    [
        '19da2ce7-138f-4427-89de-a50c724f5f54',
    ],
)
def test_map_card_popup_download_button_in_mobile(
    mobile_page: Page, data_id: str
) -> None:
    """
    Validates that clicking the download button in the map card popup opens the detail page
    and then clicking the return button navigates back to the search page.
    """
    landing_page = LandingPage(mobile_page)
    search_page = SearchPage(mobile_page)
    detail_page = DetailPage(mobile_page)

    landing_page.load()
    landing_page.search.search_for(data_id)
    search_page.wait_for_search_to_complete()

    expect(
        search_page.get_result_view_button(SearchViewLayouts.FULL_LIST.test_id)
    ).to_be_visible(timeout=_UI_TIMEOUT_MS)
    search_page.result_view_button.click()
    search_page.click_menu_item(SearchViewLayouts.MAP.test_id)
    search_page.map.wait_for_search_loading()
    expect(search_page.main_map).to_be_visible(timeout=_UI_TIMEOUT_MS)
    search_page.map.wait_for_map_idle()

    # Retries until the uncluster/cluster feature is queryable.
    search_page.map.find_and_click_data_point(data_id)

    # Card popup is visibility:hidden until a feature is selected; download is
    # disabled until collection data (summary feature) has loaded.
    popup_download_btn = search_page.card_popup_download_button.last
    expect(popup_download_btn).to_be_visible(timeout=_UI_TIMEOUT_MS)
    expect(popup_download_btn).to_be_enabled(timeout=_UI_TIMEOUT_MS)
    popup_download_btn.click()

    expect(detail_page.return_button).to_be_visible(timeout=_UI_TIMEOUT_MS)
    detail_page.return_button.click()
    expect(search_page.main_map).to_be_visible(timeout=_UI_TIMEOUT_MS)
    search_page.map.wait_for_map_loading()
    search_page.map.wait_for_map_idle()

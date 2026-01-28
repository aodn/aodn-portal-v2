import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


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
    landing_page.search.fill_search_text(data_id)
    landing_page.search.click_search_button()

    search_page.map.center_map(data_lng, data_lat)
    search_page.wait_for_page_stabilization()
    search_page.map.hover_map()

    search_page.map.wait_for_map_idle()
    search_page.result_card_download_button.last.click()

    detail_page.return_button.click()
    expect(search_page.main_map).to_be_visible()


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
    landing_page.search.fill_search_text(data_id)
    landing_page.search.click_search_button()

    search_page.result_view_button.click()
    search_page.full_map_view_button.click()
    search_page.wait_for_timeout(3000)

    search_page.map.find_and_click_data_point(data_id)
    search_page.result_card_download_button.last.click()

    detail_page.return_button.click()
    expect(search_page.main_map).to_be_visible()

import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


def test_map_full_screen_toggle(desktop_page: Page) -> None:
    """
    Verifies that the map can be toggled to full screen and back
    to the default view.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.result_list).to_be_visible()
    search_page.map.full_screen_toggle_button.click()
    expect(search_page.result_list).not_to_be_visible()
    search_page.map.full_screen_toggle_button.click()
    expect(search_page.result_list).to_be_visible()
    expect(search_page.result_card_list).not_to_have_count(0)


def test_grid_and_map_view(desktop_page: Page) -> None:
    """
    Verifies that selecting 'Grid and Map' from the 'View' options
    displays the result list in grid view.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()

    search_page.result_view_button.click()
    search_page.grid_and_map_view_button.click()
    expect(search_page.result_grid).to_be_visible()
    expect(search_page.result_card_grid).not_to_have_count(0)


def test_full_map_view(responsive_page: Page) -> None:
    """
    Verifies that selecting 'Full Map View' from the 'View' options
    displays the map in full screen by hiding the results list.
    """
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.result_list).to_be_visible()
    search_page.result_view_button.click()
    search_page.full_map_view_button.click()
    expect(search_page.result_list).not_to_be_visible()


def test_full_list_view(desktop_page: Page) -> None:
    """
    Verifies that selecting 'Full List View' from the 'View' options hides
    the map and displays only the search result list on the entire screen.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.main_map).to_be_visible()
    search_page.result_view_button.click()
    search_page.full_list_view_button.click()
    expect(search_page.main_map).not_to_be_visible()
    expect(search_page.result_list).to_be_visible()
    expect(search_page.bookmark_list).to_be_visible()


@pytest.mark.parametrize(
    'chunk_1_first_data, chunk_1_last_data, chunk_2_first_data, chunk_2_last_data',
    [
        (
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            '7b901002-b1dc-46c3-89f2-b4951cedca48',
            '7e13b5f3-4a70-4e31-9e95-335efa491c5c',
            '64d50449-efa8-45b4-ac56-4a2186fb73eb',
        ),
    ],
)
@pytest.mark.skip
def test_show_more_results(
    desktop_page: Page,
    chunk_1_first_data: str,
    chunk_1_last_data: str,
    chunk_2_first_data: str,
    chunk_2_last_data: str,
) -> None:
    """
    Verifies that the 'Show more results' button loads the next chunk of
    search results and hides the button when all results have been loaded.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_page_stabilization()
    expect(search_page.get_dataset_by_id(chunk_1_first_data)).to_be_visible()

    show_result_count_text = search_page.get_show_result_count_text(
        count=11, total=22
    )  # mock data contains total 22 items
    expect(search_page.show_result_count).to_have_text(show_result_count_text)

    search_page.scroll_down_in_result_list(1600)
    expect(search_page.get_dataset_by_id(chunk_1_last_data)).to_be_visible()
    expect(search_page.show_more_results).to_be_visible()

    search_page.click_show_more_results()
    expect(search_page.get_dataset_by_id(chunk_2_first_data)).to_be_visible()

    show_result_count_text = search_page.get_show_result_count_text(
        count=22, total=22
    )
    expect(search_page.show_result_count).to_have_text(show_result_count_text)

    search_page.scroll_down_in_result_list(1600)
    expect(search_page.get_dataset_by_id(chunk_2_last_data)).to_be_visible()
    expect(search_page.show_more_results).not_to_be_visible()


@pytest.mark.parametrize(
    'button_label, section_title',
    [
        ('Data Access', 'Data'),
    ],
)
def test_data_access_button_navigates_to_detail_page_data_access_tab(
    desktop_page: Page, button_label: str, section_title: str
) -> None:
    """
    Verifies that clicking the 'Data Access' button on a result card
    navigates to the detail page tab, where the 'Data' are listed.
    """
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    first_result = search_page.result_card_list.first

    first_result.hover()
    first_result.get_by_label(button_label).click()
    expect(detail_page.get_tab_section(section_title)).to_be_visible()


def test_view_options_on_mobile(mobile_page: Page) -> None:
    """
    Verifies that the 'View' combobox shows fewer options on mobile.
    """
    landing_page = LandingPage(mobile_page)
    search_page = SearchPage(mobile_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.result_view_button.click()
    expect(search_page.full_map_view_button).to_be_visible()
    expect(search_page.full_list_view_button).to_be_visible()
    expect(search_page.list_and_map_view_button).not_to_be_visible()
    expect(search_page.grid_and_map_view_button).not_to_be_visible()


def test_buttons_disappear_on_mobile(mobile_page: Page) -> None:
    """
    Verifies that some buttons disappear on mobile when
    the 'Full Map View' option is selected.
    """
    landing_page = LandingPage(mobile_page)
    search_page = SearchPage(mobile_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    search_page.result_view_button.click()
    search_page.full_map_view_button.click()
    expect(search_page.result_sort_button).not_to_be_visible()
    expect(search_page.result_view_button).not_to_be_visible()
    expect(search_page.bookmark_list).not_to_be_visible()
    expect(search_page.map.zoom_in_button).not_to_be_visible()
    expect(search_page.map.zoom_out_button).not_to_be_visible()

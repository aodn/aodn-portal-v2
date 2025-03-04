import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


def test_map_expand_toggle(desktop_page: Page) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.result_list).to_be_visible()
    search_page.map_toggle_control_button.click()
    expect(search_page.result_list).not_to_be_visible()
    search_page.map_toggle_control_button.click()
    expect(search_page.result_list).to_be_visible()
    expect(search_page.result_card_list).not_to_have_count(0)


@pytest.mark.parametrize(
    'view_type',
    [
        'Grid and Map',
    ],
)
def test_grid_and_map_view(desktop_page: Page, view_type: str) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()

    search_page.result_layout_button.click()
    search_page.click_text(view_type)
    expect(search_page.result_grid).to_be_visible()
    expect(search_page.result_card_grid).not_to_have_count(0)


@pytest.mark.parametrize(
    'view_type',
    [
        'Full Map View',
    ],
)
def test_full_map_view(responsive_page: Page, view_type: str) -> None:
    landing_page = LandingPage(responsive_page)
    search_page = SearchPage(responsive_page)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.result_list).to_be_visible()
    search_page.result_layout_button.click()
    search_page.click_text(view_type)
    expect(search_page.result_list).not_to_be_visible()


@pytest.mark.parametrize(
    'view_type',
    [
        'Full List View',
    ],
)
def test_full_list_view(desktop_page: Page, view_type: str) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.main_map).to_be_visible()
    search_page.result_layout_button.click()
    search_page.click_text(view_type)
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
def test_show_more_results(
    desktop_page: Page,
    chunk_1_first_data: str,
    chunk_1_last_data: str,
    chunk_2_first_data: str,
    chunk_2_last_data: str,
) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
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
    'link_title',
    [
        'Data Link',
    ],
)
def test_links_button_navigates_to_detail_links_tab(
    desktop_page: Page, link_title: str
) -> None:
    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()

    first_result = search_page.result_card_list.first

    first_result.hover()
    first_result.get_by_label('Links').click()
    expect(detail_page.get_text(link_title)).to_be_visible()

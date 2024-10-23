import pytest
from playwright.sync_api import Page, expect

from pages.landing_page import LandingPage
from pages.search_page import SearchPage

@pytest.mark.skip(reason="Skipping this test because of timeout issue")
def test_map_expand_toggle(page_mock: Page) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

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

@pytest.mark.skip(reason="Skipping this test because of timeout issue")
def test_grid_and_map_view(page_mock: Page, view_type: str) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()

    search_page.view_button.click()
    search_page.click_text(view_type)
    expect(search_page.result_grid).to_be_visible()
    expect(search_page.result_card_grid).not_to_have_count(0)


@pytest.mark.parametrize(
    'view_type',
    [
        'Full Map View',
    ],
)

@pytest.mark.skip(reason="Skipping this test because of timeout issue")
def test_full_map_view(page_mock: Page, view_type: str) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()

    expect(search_page.result_list).to_be_visible()
    search_page.view_button.click()
    search_page.click_text(view_type)
    expect(search_page.result_list).not_to_be_visible()


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


@pytest.mark.skip(reason="Skipping this test because of timeout issue")
def test_show_more_results(
    page_mock: Page,
    chunk_1_first_data: str,
    chunk_1_last_data: str,
    chunk_2_first_data: str,
    chunk_2_last_data: str,
) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)

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
    search_page.wait_for_search_to_complete()
    expect(search_page.get_dataset_by_id(chunk_2_first_data)).to_be_visible()

    show_result_count_text = search_page.get_show_result_count_text(
        count=22, total=22
    )
    expect(search_page.show_result_count).to_have_text(show_result_count_text)

    search_page.scroll_down_in_result_list(1600)
    expect(search_page.get_dataset_by_id(chunk_2_last_data)).to_be_visible()
    expect(search_page.show_more_results).not_to_be_visible()

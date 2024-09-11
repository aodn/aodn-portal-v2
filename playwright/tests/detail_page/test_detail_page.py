import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'title',
    [
        ('Integrated Marine Observing System (IMOS) - Location of assets'),
        ('IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility'),
    ],
)
def test_tab_panel_scroll(page_mock: Page, title: str) -> None:
    landing_page = LandingPage(page_mock)
    search_page = SearchPage(page_mock)
    detail_page = DetailPage(page_mock)

    landing_page.load()
    landing_page.search.click_search_button()
    page_mock.wait_for_timeout(2000)
    search_page.click_dataset(title)

    expect(detail_page.page_title).to_have_text(title)
    detail_page.tabs.scroll_right()
    expect(detail_page.tabs.global_attr.tab).to_be_in_viewport()
    detail_page.tabs.scroll_left()
    expect(detail_page.tabs.abstract.tab).to_be_in_viewport()


@pytest.mark.parametrize(
    'title, uuid, tab, not_found_item',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Metadata Information',
            'Metadata Link',
        ),
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'About',
            'Credits',
        ),
    ],
)
def test_not_found_item(
    page_mock: Page, title: str, uuid: str, tab: str, not_found_item: str
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)

    detail_page.click_tab(tab)
    expect(detail_page.get_not_found_element(not_found_item)).to_be_visible()


@pytest.mark.parametrize(
    'title, uuid, tab, contact_button, address, phone, link',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'About',
            'Integrated Marine Observing System (IMOS)',
            'Private Bag 110',
            '61 3 6226 7488',
            'Website of the Australian Ocean Data Network (AODN)',
        )
    ],
)
def test_contact_details(
    page_mock: Page,
    title: str,
    uuid: str,
    tab: str,
    contact_button: str,
    address: str,
    phone: str,
    link: str,
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)

    detail_page.click_tab(tab)
    detail_page.click_button(contact_button)

    expect(detail_page.contact_area.address).to_contain_text(address)
    expect(detail_page.contact_area.phone).to_contain_text(phone)
    expect(detail_page.contact_area.link).to_contain_text(link)


@pytest.mark.parametrize(
    'title, uuid, tab, item_list',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'About',
            'Keywords',
        ),
    ],
)
def test_show_more_and_less_list_items(
    page_mock: Page, title: str, uuid: str, tab: str, item_list: str
) -> None:
    detail_page = DetailPage(page_mock)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.click_tab(tab)

    keywords = detail_page.get_collapse_list(item_list)
    initial_count = keywords.count()

    detail_page.click_show_more(item_list)
    expect(keywords).not_to_have_count(initial_count)
    assert keywords.count() > initial_count

    detail_page.click_show_less(item_list)
    expect(keywords).to_have_count(initial_count)

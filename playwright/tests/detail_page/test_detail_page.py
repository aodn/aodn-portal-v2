import pytest
from playwright.sync_api import Page, expect

from core.constants.devices import DesktopDevices
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage
from pages.search_page import SearchPage


@pytest.mark.parametrize(
    'title',
    [
        ('Integrated Marine Observing System (IMOS) - Location of assets'),
    ],
)
def test_tab_panel_scroll(desktop_page: Page, title: str) -> None:
    """
    Verifies that the tab panel on the detail page supports scrolling to navigate
    between tabs when the browser window is resized to a smaller viewport,
    causing tabs to overflow.

    The test loads a dataset on the detail page, scrolls right to confirm the
    'Related Resources' tab becomes visible, and scrolls left to confirm the
    'Summary' tab becomes visible, ensuring the UI's tab panel scrolling
    functionality works as intended.
    """
    # Precondition: Tab panel should have scroll buttons
    # Set a smaller browser window size to make the tabs scrollable
    desktop_page.set_viewport_size(DesktopDevices.SMALL)

    landing_page = LandingPage(desktop_page)
    search_page = SearchPage(desktop_page)
    detail_page = DetailPage(desktop_page)

    landing_page.load()
    landing_page.search.click_search_button()
    search_page.wait_for_search_to_complete()
    search_page.click_dataset(title)
    expect(detail_page.page_title).to_have_text(title)

    detail_page.tabs.scroll_right()
    expect(detail_page.tabs.related_resources.tab).to_be_in_viewport()
    detail_page.tabs.scroll_left()
    expect(detail_page.tabs.summary.tab).to_be_in_viewport()


@pytest.mark.parametrize(
    'title, uuid, not_found_item',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'License',
        ),
    ],
)
def test_not_found_item(
    responsive_page: Page, title: str, uuid: str, not_found_item: str
) -> None:
    """
    Validates that the detail page correctly displays a not found message for
    a specific data category when the dataset lacks that information.

    The test loads a dataset on the detail page, verifies the page title matches
    the expected dataset title, and checks that the specified not found item
    (e.g., 'License') is visible, ensuring the UI accurately indicates
    missing data for the dataset.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)

    expect(detail_page.get_not_found_element(not_found_item)).to_be_visible()


@pytest.mark.parametrize(
    'title, uuid, tab, contact_button, address, phone, link',
    [
        (
            'Integrated Marine Observing System (IMOS) - Location of assets',
            '1fba3a57-35f4-461b-8a0e-551af229714e',
            'Citation and Usage',
            'Integrated Marine Observing System (IMOS)',
            'Private Bag 110',
            '61 3 6226 7488',
            'Website of the Australian Ocean Data Network (AODN)',
        )
    ],
)
def test_contact_details(
    responsive_page: Page,
    title: str,
    uuid: str,
    tab: str,
    contact_button: str,
    address: str,
    phone: str,
    link: str,
) -> None:
    """
    Verifies that the detail page accurately displays contact details for a
    dataset within the specified tab.

    The test loads a dataset on the detail page, navigates to the designated
    tab, expands the contact section, and checks that the address, phone
    number, and link fields contain the expected values, ensuring the
    UI correctly presents all contact information.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)

    detail_page.click_tab(tab)
    detail_page.get_collapse_item_title(contact_button).click()

    expect(detail_page.contact_area.address.first).to_contain_text(address)
    expect(detail_page.contact_area.phone.first).to_contain_text(phone)
    expect(detail_page.contact_area.link.first).to_contain_text(link)


@pytest.mark.parametrize(
    'title, uuid, tab, item_list',
    [
        (
            'IMOS Bio-Acoustic Ships of Opportunity (BA SOOP) Sub-Facility',
            '0015db7e-e684-7548-e053-08114f8cd4ad',
            'Additional Information',
            'Keywords',
        ),
    ],
)
def test_show_more_and_less_list_items(
    responsive_page: Page, title: str, uuid: str, tab: str, item_list: str
) -> None:
    """
    Validates that the 'Show More' and 'Show Less' buttons on the detail page
    correctly expand and collapse a list of items when the list exceeds five entries.
    """
    detail_page = DetailPage(responsive_page)

    detail_page.load(uuid)
    expect(detail_page.page_title).to_have_text(title)
    detail_page.click_tab(tab)

    keywords = detail_page.get_collapse_list_items(item_list)
    initial_count = keywords.count()

    detail_page.click_show_more(item_list)
    expect(keywords).not_to_have_count(initial_count)
    assert keywords.count() > initial_count

    detail_page.click_show_less(item_list)
    expect(keywords).to_have_count(initial_count)


# When a dropdown appear, we will disable scroll because of the material-ui drop down will make the list flow on top
# and scroll will make the list flow around. When the dropdown item selected, we will resume the scroll wheel action.
@pytest.mark.parametrize(
    'uuid',
    [
        '0015db7e-e684-7548-e053-08114f8cd4ad',
    ],
)
def test_dropdown_scroll(responsive_page: Page, uuid: str) -> None:
    """
    Verifies that the page's scroll functionality is disabled when a dropdown
    element is open and re-enabled after the dropdown is closed.
    """
    detail_page = DetailPage(responsive_page)
    detail_page.load(uuid)
    # The Download Card with a dropdown
    detail_page.select_elements.first.click()
    try:
        detail_page.scroll_to_bottom()
    except Exception as error:
        print(error)

    scroll_position = detail_page.get_page_scroll_y()
    assert scroll_position == 0
    # Drop down disappear, now we can scroll
    detail_page.body.click()
    detail_page.scroll_to_bottom()
    new_scroll_position = detail_page.get_page_scroll_y()
    assert new_scroll_position > scroll_position

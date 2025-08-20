import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage
from pages.landing_page import LandingPage


@pytest.mark.parametrize(
    'dataset_id, dataset_title',
    [
        (
            'Coastal Wave Buoys',
            'Wave buoys Observations - Australia - near real-time',
        ),
    ],
)
def test_featured_datasets(
    responsive_page: Page, dataset_id: str, dataset_title: str
) -> None:
    """
    Verifies that clicking on a featured dataset navigates to the detail page
    and that the detail page loads correctly with the expected title.
    """
    landing_page = LandingPage(responsive_page)
    landing_page.load()

    dataset = landing_page.get_by_test_id(dataset_id)
    expect(dataset).to_be_visible()

    # Get the new Tab
    with responsive_page.context.expect_page() as new_page_info:
        dataset.click()
    detail_page = DetailPage(new_page_info.value)

    detail_page.wait_for_load_state()
    expect(detail_page.page_title).to_have_text(dataset_title)
    detail_page.close()

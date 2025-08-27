import pytest
from playwright.sync_api import Page, expect

from mocks.api.collection_detail import (
    handle_detail_api,
    handle_detail_item_api,
)
from mocks.api_router import ApiRouter
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

    # Get the new Tab instance after clicking the dataset link
    with responsive_page.context.expect_page() as new_page_info:
        dataset.click()
    new_page = new_page_info.value
    # Add API mocking to the new page
    api_router = ApiRouter(new_page)
    api_router.route_collection_detail(
        handle_detail_api, handle_detail_item_api
    )

    detail_page = DetailPage(new_page_info.value)
    detail_page.wait_for_load_state()
    expect(detail_page.page_title).to_have_text(dataset_title)
    detail_page.close()

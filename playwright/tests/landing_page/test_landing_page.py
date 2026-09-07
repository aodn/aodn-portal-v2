import pytest
from playwright.sync_api import Page, expect

from mocks.apply import apply_mock
from pages.detail_page import DetailPage
from pages.landing_page import LandingPage


FEEDBACK_URL = (
    'https://forms.office.com/pages/responsepage.aspx?'
    'id=VV3rFZEZvEaNp6slI03uCIbxNcrqZltDmWw3jsls7JBUMEJTRENHV1o4QzcyWUtKUzJZU1U2SDk1US4u&route=shorturl'
)


def test_feedback_button_on_desktop(desktop_page: Page) -> None:
    landing_page = LandingPage(desktop_page)
    landing_page.load()

    expect(landing_page.feedback_button).to_be_visible()
    expect(landing_page.feedback_button).to_have_attribute('href', FEEDBACK_URL)
    expect(
        landing_page.hero_text.get_by_test_id('feedback-button')
    ).to_have_count(0)


def test_feedback_button_in_mobile_hero(mobile_page: Page) -> None:
    landing_page = LandingPage(mobile_page)
    landing_page.load()

    feedback_button = landing_page.hero_text.get_by_test_id('feedback-button')
    expect(feedback_button).to_be_visible()
    expect(feedback_button).to_have_attribute('href', FEEDBACK_URL)


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
    apply_mock(new_page)

    detail_page = DetailPage(new_page_info.value)
    detail_page.wait_for_load_state()
    expect(detail_page.page_title).to_have_text(dataset_title)
    detail_page.close()

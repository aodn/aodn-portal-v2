from http import HTTPStatus

import pytest
from playwright.sync_api import Page, expect

from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage
from pages.downloads_page import DownloadsPage

DOWNLOAD_JOB_ID = 'f358dc2f-e211-4bf1-95c4-c513ef57c2b6'


@pytest.mark.parametrize(
    'uuid, email, default_button_text, success_button_text',
    [
        (
            'b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc',
            'test@email.com',
            'I understand, process download',
            'Download email will be sent shortly',
        ),
    ],
)
def test_download_dialog_success(
    responsive_page: Page,
    uuid: str,
    email: str,
    default_button_text: str,
    success_button_text: str,
) -> None:
    """
    Tests successful download request flow in the detail page download dialog.

    - Loads detail page and opens download dialog
    - Enters valid email and progresses through steps
    - Submits request with default mock response (success)
    - Verifies button text changes to success message after submission
    """
    detail_page = DetailPage(responsive_page)
    detail_page.load(uuid)

    detail_page.download_button.click()
    expect(detail_page.download_dialog).to_be_visible()

    # Step 1: enter email and move to confirmation screen
    detail_page.download_email_input.fill(email)
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(default_button_text)
    # Step 2: confirm request and expect success feedback
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(success_button_text)

    detail_page.view_download_status_link.click()
    downloads_page = DownloadsPage(responsive_page)
    expect(downloads_page.heading).to_be_visible()
    expect(downloads_page.status_table).to_contain_text(DOWNLOAD_JOB_ID)
    expect(downloads_page.status_table).to_contain_text('50s')
    expect(downloads_page.status_table).to_contain_text('Completed')
    expect(downloads_page.status_table).to_contain_text(
        'Test Ocean Data Collection'
    )
    expect(downloads_page.status_table).to_contain_text(
        'imos-data/dataset.zarr'
    )
    expect(downloads_page.status_table).to_contain_text('NETCDF')

    responsive_page.set_viewport_size({'width': 900, 'height': 800})
    expect(downloads_page.status_cards).to_have_count(1)

    # A narrower desktop/laptop width (below the old 1440 "above desktop"
    # cutoff) should still get the table, not the stacked card layout.
    responsive_page.set_viewport_size({'width': 1170, 'height': 900})
    expect(downloads_page.status_cards).to_have_count(0)
    expect(downloads_page.desktop_status_table).to_be_visible()


@pytest.mark.parametrize(
    'uuid, email, default_button_text, timeout_button_text, server_error_button_text, dataset_error_button_text',
    [
        (
            'b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc',
            'test@email.com',
            'I understand, process download',
            'Request timeout! Please try again later',
            'Server error! Please try again later',
            'Dataset unavailable! Please try again later',
        ),
    ],
)
def test_download_dialog_errors(
    desktop_page: Page,
    uuid: str,
    email: str,
    default_button_text: str,
    timeout_button_text: str,
    server_error_button_text: str,
    dataset_error_button_text: str,
) -> None:
    """
    Tests download dialog behavior for different backend error responses.

    - Opens dialog and reaches confirmation screen
    - Overrides mock response sequentially for three error cases (408, 500, 400)
    - Verifies appropriate error message appears on the submit button after each submission
    """
    api_router = ApiRouter(desktop_page)
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    detail_page.download_button.click()
    expect(detail_page.download_dialog).to_be_visible()

    # Reach confirmation screen first
    detail_page.download_email_input.fill(email)
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(default_button_text)

    # Test case 1: timeout simulation
    api_router.route_download_dialog(
        lambda route: route.fulfill(
            status=HTTPStatus.OK,
            json={'status': {'message': '408'}},
        )
    )
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(timeout_button_text)

    # Test case 2: internal server error simulation
    api_router.route_download_dialog(
        lambda route: route.fulfill(
            status=HTTPStatus.OK,
            json={'status': {'message': '500'}},
        )
    )
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(server_error_button_text)

    # Test case 3: dataset unavailable simulation
    api_router.route_download_dialog(
        lambda route: route.fulfill(
            status=HTTPStatus.OK,
            json={'status': {'message': '400'}},
        )
    )
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(dataset_error_button_text)


@pytest.mark.parametrize(
    'uuid, email, default_button_text, limit_reached_button_text',
    [
        (
            'b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc',
            'test@email.com',
            'I understand, process download',
            'You already have 10 downloads in progress',
        ),
    ],
)
def test_download_dialog_rate_limited(
    desktop_page: Page,
    uuid: str,
    email: str,
    default_button_text: str,
    limit_reached_button_text: str,
) -> None:
    """
    Tests feedback when the recipient already has 10 downloads running.

    - Overrides the mock so the execute call returns HTTP 429
    - Verifies the button reports a distinct "at your limit" message, not a
      generic failure, and that no job id / download status link is offered
    """
    api_router = ApiRouter(desktop_page)
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    detail_page.download_button.click()
    expect(detail_page.download_dialog).to_be_visible()

    detail_page.download_email_input.fill(email)
    detail_page.dialog_button.click()
    expect(detail_page.dialog_button).to_contain_text(default_button_text)

    api_router.route_download_dialog(
        lambda route: route.fulfill(
            status=HTTPStatus.TOO_MANY_REQUESTS,
            json={
                'timestamp': '2026-09-02T10:15:30',
                'message': (
                    'You already have 10 downloads in progress. Wait for '
                    'one of them to complete before starting another.'
                ),
                'details': 'uri=/api/v1/ogc/processes/download/execution',
            },
        )
    )
    detail_page.dialog_button.click()

    expect(detail_page.dialog_button).to_contain_text(
        limit_reached_button_text
    )
    expect(detail_page.view_download_status_link).not_to_be_visible()

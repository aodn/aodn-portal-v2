from http import HTTPStatus
from pathlib import Path

import pytest
from playwright.sync_api import Page, expect

from mocks.api_router import ApiRouter
from pages.detail_page import DetailPage


@pytest.mark.parametrize(
    'uuid, alert_message',
    [
        (
            '06b09398-d3d0-47dc-a54a-a745319fbece',
            'WFS data download completed successfully',
        ),
    ],
)
def test_download_wfs(
    responsive_page: Page, tmp_path: Path, uuid: str, alert_message: str
) -> None:
    """
    Tests successful WFS direct download flow on the detail page.

    - Loads detail page and triggers file download via button
    - Uses default mock to return valid SSE stream response
    - Waits for download completion and success alert
    - Verifies downloaded file exists and is non-empty
    """
    detail_page = DetailPage(responsive_page)
    detail_page.load(uuid)

    # Trigger download and save to temporary directory
    download_path = detail_page.download_file(
        action=detail_page.download_button.click, tmp_directory_path=tmp_path
    )
    # Expect success feedback
    expect(detail_page.download_status_alert).to_have_text(alert_message)

    # Verify file was actually downloaded
    assert download_path.exists()
    assert download_path.stat().st_size > 0


@pytest.mark.parametrize(
    'uuid, alert_message',
    [
        (
            '06b09398-d3d0-47dc-a54a-a745319fbece',
            'Download incomplete - connection closed unexpectedly',
        ),
    ],
)
def test_incomplete_download_wfs(
    desktop_page: Page, uuid: str, alert_message: str
) -> None:
    """
    Tests handling of incomplete WFS download (invalid/missing SSE stream).

    - Overrides default mock to return plain text instead of SSE stream
    - Triggers download and waits for error detection
    - Verifies appropriate incomplete-download alert is shown
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    api_router = ApiRouter(desktop_page)
    # Simulate incomplete response (no proper SSE format)
    api_router.route_download_wfs(
        lambda route: route.fulfill(
            status=HTTPStatus.OK,
            body='incomplete data',
        )
    )

    detail_page.download_button.click()
    expect(detail_page.download_status_alert).to_have_text(alert_message)
    detail_page.prevent_http_proxy_errors()


@pytest.mark.parametrize(
    'uuid, alert_message',
    [
        (
            '06b09398-d3d0-47dc-a54a-a745319fbece',
            'Failed to start WFS download',
        ),
    ],
)
def test_download_wfs_cancellation(
    desktop_page: Page, uuid: str, alert_message: str
) -> None:
    """
    Tests user-initiated cancellation of WFS download.

    - Overrides mock to abort the request (simulates long-running download)
    - Clicks download → then cancel button
    - Verifies cancellation alert is displayed
    """
    detail_page = DetailPage(desktop_page)
    detail_page.load(uuid)

    api_router = ApiRouter(desktop_page)
    # Abort request to simulate cancellable long-running download
    api_router.route_download_wfs(lambda route: route.abort())

    detail_page.download_button.click()

    detail_page.cancel_download_button.click()
    expect(detail_page.download_status_alert).to_have_text(alert_message)
    detail_page.prevent_http_proxy_errors()

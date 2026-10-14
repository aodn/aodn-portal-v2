import pytest
from playwright.sync_api import Page, expect

from pages.detail_page import DetailPage


def test_bbox_drag(responsive_page: Page) -> None:
    """Mouse and native mobile touch draw a stationary, accurate, deletable BBOX."""
    detail = DetailPage(responsive_page)
    detail.load('0015db7e-e684-7548-e053-08114f8cd4ad')
    detail.go_to_map_tab()
    map_component = detail.detail_map
    map_component.wait_for_map_loading()
    map_component.wait_for_layer_select_loading()
    map_component.close_bookmark_menu()
    touch = responsive_page.evaluate('() => navigator.maxTouchPoints > 0')
    # Include a preceding map tap to exercise competing touch recognizers.
    if touch:
        x, y = map_component.calculate_mouse_coordinates(left=40, up=40)
        responsive_page.touchscreen.tap(x, y)
    map_component.rectangle_menu_button.click()
    map_component.container.get_by_test_id('menu-tooltip').get_by_role(
        'button'
    ).click()
    start, end = map_component.bbox_drag(touch=touch)
    snapshot = map_component.bbox_snapshot()
    assert snapshot['dragPan']
    assert len(snapshot['features']) == 1
    ring = snapshot['features'][0]['geometry']['coordinates'][0]
    expected = [start, [end[0], start[1]], end, [start[0], end[1]], start]
    for actual, corner in zip(ring, expected, strict=True):
        assert actual == pytest.approx(corner)
    # Select the BBOX, then exercise the existing deletion control.
    map_component.click_map_center()
    selected = map_component.bbox_snapshot()
    assert selected['selected'] == [selected['features'][0]['id']]
    map_component.reset_button.click()
    expect(map_component.reset_button).to_be_disabled()
    assert map_component.bbox_snapshot()['features'] == []


def test_bbox_tap_and_cancel(mobile_page: Page) -> None:
    """A tap discards zero area; cancelling the next BBOX restores navigation."""
    detail = DetailPage(mobile_page)
    detail.load('0015db7e-e684-7548-e053-08114f8cd4ad')
    detail.go_to_map_tab()
    map_component = detail.detail_map
    map_component.wait_for_map_loading()
    map_component.wait_for_layer_select_loading()
    map_component.rectangle_menu_button.click()
    map_component.container.get_by_test_id('menu-tooltip').get_by_role(
        'button'
    ).click()
    x, y = map_component.calculate_mouse_coordinates(left=40, up=40)
    mobile_page.touchscreen.tap(x, y)
    mobile_page.wait_for_function(
        """id => window.__map_functions.getMap(id)._controls
            .find(control => control.getAll).getMode() === 'simple_select'
        """,
        arg=map_component.map_id,
    )
    assert map_component.bbox_snapshot()['features'] == []
    assert map_component.bbox_snapshot()['dragPan']
    map_component.rectangle_menu_button.click()
    map_component.rectangle_menu_button.click()
    assert map_component.bbox_snapshot()['dragPan']
    before = map_component.get_map_center()
    session = mobile_page.context.new_cdp_session(mobile_page)
    session.send(
        'Input.dispatchTouchEvent',
        {
            'type': 'touchStart',
            'touchPoints': [{'x': x, 'y': y}],
        },
    )
    session.send(
        'Input.dispatchTouchEvent',
        {
            'type': 'touchMove',
            'touchPoints': [{'x': x + 60, 'y': y + 60}],
        },
    )
    session.send(
        'Input.dispatchTouchEvent',
        {
            'type': 'touchEnd',
            'touchPoints': [],
        },
    )
    session.detach()
    mobile_page.evaluate('() => new Promise(requestAnimationFrame)')
    assert map_component.get_map_center() != before


def test_bbox_preserves_disabled_navigation(mobile_page: Page) -> None:
    """Finishing a BBOX leaves previously disabled map controls disabled."""
    detail = DetailPage(mobile_page)
    detail.load('0015db7e-e684-7548-e053-08114f8cd4ad')
    detail.go_to_map_tab()
    map_component = detail.detail_map
    map_component.wait_for_map_loading()
    map_component.wait_for_layer_select_loading()
    map_component.disable_bbox_navigation()
    map_component.rectangle_menu_button.click()
    map_component.container.get_by_test_id('menu-tooltip').get_by_role(
        'button'
    ).click()
    map_component.bbox_drag(touch=True)
    mobile_page.evaluate('() => new Promise(requestAnimationFrame)')
    snapshot = map_component.bbox_snapshot()
    assert not snapshot['dragPan']
    assert not snapshot['doubleClickZoom']

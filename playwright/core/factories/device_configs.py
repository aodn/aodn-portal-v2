from playwright.sync_api import Playwright

from core.dataclasses.device_config import DeviceConfig


def get_mobile_config(playwright: Playwright) -> DeviceConfig:
    iphone_se = playwright.devices['iPhone SE']
    return DeviceConfig(
        is_mobile=True,
        viewport={'width': 375, 'height': 667},
        device_config=iphone_se,
    )


def get_desktop_config() -> DeviceConfig:
    return DeviceConfig(
        is_mobile=False, viewport={'width': 1920, 'height': 1080}
    )

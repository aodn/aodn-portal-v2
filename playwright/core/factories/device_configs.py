from playwright.sync_api import Playwright

from core.constants.devices import DesktopDevices, MobileDevices
from core.dataclasses.device_config import DeviceConfig


def get_mobile_config(playwright: Playwright) -> DeviceConfig:
    iphone_se = playwright.devices[MobileDevices.IPHONE_SE['device_name']]
    return DeviceConfig(
        is_mobile=True,
        viewport=MobileDevices.IPHONE_SE['viewport'],
        device_config=iphone_se,
    )


def get_desktop_config() -> DeviceConfig:
    return DeviceConfig(is_mobile=False, viewport=DesktopDevices.EXTRA_LARGE)

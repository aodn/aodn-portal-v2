from core.types.devices import MobileDevice, Viewport


class MobileDevices:
    """
    Static configuration class for mobile device properties.
    """

    IPHONE_SE: MobileDevice = {
        'device_name': 'iPhone 14',
        'viewport': {'width': 320, 'height': 640},
    }


class DesktopDevices:
    """
    Static configuration class for desktop viewport properties.
    """

    SMALL: Viewport = {'width': 768, 'height': 1024}
    MEDIUM: Viewport = {'width': 1280, 'height': 720}
    LARGE: Viewport = {'width': 1440, 'height': 900}
    EXTRA_LARGE: Viewport = {'width': 1920, 'height': 1080}

from core.types.devices import MobileDevice, Viewport


class MobileDevices:
    """
    Static configuration class for mobile device properties.
    """

    IPHONE_SE: MobileDevice = {
        'device_name': 'iPhone SE',
        'viewport': {'width': 375, 'height': 667},
    }


class DesktopDevices:
    """
    Static configuration class for desktop viewport properties.
    """

    EXTRA_SMALL: Viewport = {'width': 800, 'height': 768}
    SMALL: Viewport = {'width': 1366, 'height': 768}
    STANDARD: Viewport = {'width': 1920, 'height': 1080}
    WIDE: Viewport = {'width': 2560, 'height': 1440}

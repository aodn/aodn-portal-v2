from dataclasses import dataclass

from core.types.devices import Viewport


@dataclass
class DeviceConfig:
    is_mobile: bool
    viewport: Viewport
    device_config: dict | None = None

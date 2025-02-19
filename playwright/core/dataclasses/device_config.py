from dataclasses import dataclass


@dataclass
class DeviceConfig:
    is_mobile: bool
    viewport: dict[str, int]
    device_config: dict | None = None

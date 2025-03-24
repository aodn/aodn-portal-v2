from typing import TypedDict


class Viewport(TypedDict):
    width: int
    height: int


class MobileDevice(TypedDict):
    device_name: str
    viewport: Viewport

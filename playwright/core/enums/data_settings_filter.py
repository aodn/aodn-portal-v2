from enum import Enum


class DataSettingsFilter(Enum):
    REALTIME = ('Real Time', 'real-time')
    DELAYED = ('Delayed', 'delayed')
    ONE_OFF = ('One-off', 'other')

    @property
    def label(self) -> str:
        return self.value[0]

    @property
    def _value(self) -> str:
        return self.value[1]

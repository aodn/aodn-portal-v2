from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.components.tabs.additional_information import (
    AdditionalInformationTab,
)
from pages.components.tabs.citation_and_usage import CitationAndUsageTab
from pages.components.tabs.data_access import DataAccessTab
from pages.components.tabs.related_resources import RelatedResourcesTab
from pages.components.tabs.summary import SummaryTab


class TabContainerComponent(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # locators
        self.tabs_panel_container = self.page.get_by_test_id(
            'tabs-panel-container'
        )

        # Tabs
        self.summary = SummaryTab(page)
        self.data_access = DataAccessTab(page)
        self.citation_and_usage = CitationAndUsageTab(page)
        self.additional_info = AdditionalInformationTab(page)
        self.related_resources = RelatedResourcesTab(page)

    def scroll_right(self) -> None:
        self.tabs_panel_container.hover()
        self.page.mouse.wheel(500, 0)

    def scroll_left(self) -> None:
        self.tabs_panel_container.hover()
        self.page.mouse.wheel(-500, 0)

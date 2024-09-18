from playwright.sync_api import Page

from pages.base_page import BasePage
from pages.components.tabs.about import AboutTab
from pages.components.tabs.abstract import AbstractTab
from pages.components.tabs.associated_records import AssociatedRecordsTab
from pages.components.tabs.citation import CitationTab
from pages.components.tabs.global_attr import GlobalAttrTab
from pages.components.tabs.lineage import LineageTab
from pages.components.tabs.links import LinksTab
from pages.components.tabs.metadata_info import MetadataInfoTab


class TabContainerComponent(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Tabs
        self.abstract = AbstractTab(page)
        self.about = AboutTab(page)
        self.links = LinksTab(page)
        self.lineage = LineageTab(page)
        self.metadata_info = MetadataInfoTab(page)
        self.citation = CitationTab(page)
        self.associated_records = AssociatedRecordsTab(page)
        self.global_attr = GlobalAttrTab(page)

    def scroll_right(self) -> None:
        self.page.get_by_test_id('KeyboardArrowRightIcon').click()

    def scroll_left(self) -> None:
        self.page.get_by_test_id('KeyboardArrowLeftIcon').click()

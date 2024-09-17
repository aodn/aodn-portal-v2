from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class MetadataInfoTab(BasePage):
    TAB_NAME = 'Metadata Information'
    METADATA_CONTACT = 'Metadata Contact'
    METADATA_IDENTIFIER = 'Metadata Identifier'
    FULL_METADATA_LINK = 'Full Metadata Link'
    METADATA_DATES = 'Metadata Dates'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        # sections
        self.metadata_contact = self.get_button('Metadata Contact')
        self.metadata_identifier = self.get_button('Metadata Identifier')
        self.full_metadata_link = self.get_button('Full Metadata Link')
        self.metadata_dates = self.get_button('Metadata Dates')

        # other
        self.metadata_contact_title = page.get_by_test_id(
            'metadata-contact-title'
        )

    def get_metadata_identifier_list(self) -> Locator:
        return self.get_collapse_list(self.METADATA_IDENTIFIER)

    def get_full_metadata_link_list(self) -> Locator:
        return self.get_collapse_list(self.FULL_METADATA_LINK)

    def get_metadata_dates_list(self) -> Locator:
        return self.get_collapse_list(self.METADATA_DATES)

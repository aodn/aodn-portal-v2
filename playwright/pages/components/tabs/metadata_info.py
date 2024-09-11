from playwright.sync_api import Page

from pages.base_page import BasePage


class MetadataInfoTab(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab('Metadata Information')
        # sections
        self.metadata_contact = self.get_button('Metadata Contact')
        self.metadata_identifier = self.get_button('Metadata Identifier')
        self.full_metadata_link = self.get_button('Full Metadata Link')
        self.metadata_dates = self.get_button('Metadata Dates')

        # other
        self.meradata_contact_title = page.get_by_test_id(
            'metadata-contact-title'
        )

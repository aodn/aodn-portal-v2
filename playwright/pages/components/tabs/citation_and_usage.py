from playwright.sync_api import Locator, Page

from pages.base_page import BasePage


class CitationAndUsageTab(BasePage):
    TAB_NAME = 'Citation and Usage'
    SUGGESTED_CITATION = 'Suggested Citation'
    CITED_RESPONSIBLE_PARTIES = 'Cited Responsible Parties'
    LICENSE = 'License'
    CONSTRAINTS = 'Constraints'
    DATA_CONTACT = 'Data Contact'
    CREDITS = 'Credits'

    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab(self.TAB_NAME)
        # sections
        self.suggested_citation = self.get_button(self.SUGGESTED_CITATION)
        self.cited_responsible_parties = self.get_button(
            self.CITED_RESPONSIBLE_PARTIES
        )
        self.license = self.get_button(self.LICENSE)
        self.constraints = self.get_button(self.CONSTRAINTS)
        self.data_contact = self.get_button(self.DATA_CONTACT)
        self.credits = self.get_button(self.CREDITS)

    def get_suggested_citation_list(self) -> Locator:
        return self.get_collapse_list(self.SUGGESTED_CITATION)

    def get_cited_responsible_parties_list(self) -> Locator:
        return self.get_collapse_list(self.CITED_RESPONSIBLE_PARTIES)

    def get_license_list(self) -> Locator:
        return self.get_collapse_list(self.LICENSE)

    def get_constraints_list(self) -> Locator:
        return self.get_collapse_list(self.CONSTRAINTS)

    def get_data_contact_list(self) -> Locator:
        return self.get_collapse_list(self.DATA_CONTACT)

    def get_credits_list(self) -> Locator:
        return self.get_collapse_list(self.CREDITS)

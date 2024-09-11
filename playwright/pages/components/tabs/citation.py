from playwright.sync_api import Page

from pages.base_page import BasePage


class CitationTab(BasePage):
    def __init__(self, page: Page):
        self.page = page

        # Page locators
        self.tab = self.get_tab('Citation')
        # sections
        self.cited_responsible_parties = self.get_button(
            'Cited Responsible Parties'
        )
        self.license = self.get_button('License')
        self.suggested_citation = self.get_button('Suggested Citation')
        self.constranits = self.get_button('Constraints')

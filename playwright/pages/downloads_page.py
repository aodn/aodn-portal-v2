from playwright.sync_api import Page

from config import settings
from pages.base_page import BasePage


class DownloadsPage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)
        self.page = page
        self.heading = page.get_by_role('heading', name='Downloads', level=1)
        self.status_table = page.get_by_label('Download status', exact=True)
        self.status_cards = self.status_table.get_by_role('listitem')
        self.desktop_status_table = page.get_by_role(
            'table', name='Download status'
        )

    def load(self) -> None:
        self.page.goto(f'{settings.baseURL}/downloads', wait_until='load')

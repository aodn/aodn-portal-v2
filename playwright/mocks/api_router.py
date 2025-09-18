from typing import Callable, Optional

from playwright.sync_api import Page

from mocks.routes import Routes


class ApiRouter:
    def __init__(self, page: Page) -> None:
        self.page = page
        self.routes: dict = {}

    def route(self, route_url: str, handler_function: Callable) -> None:
        self.page.route(route_url, handler_function)
        self.routes[route_url] = handler_function

    def unroute(
        self, route_url: str, handler_function: Optional[Callable] = None
    ) -> None:
        if handler_function:
            self.page.unroute(route_url, handler_function)
            if route_url in self.routes:
                del self.routes[route_url]
        else:
            if route_url in self.routes:
                self.page.unroute(route_url, self.routes[route_url])
                del self.routes[route_url]

    def route_category(self, handler_function: Callable) -> None:
        self.route(Routes.CATEGORY, handler_function)

    def unroute_category(
        self, handler_function: Optional[Callable] = None
    ) -> None:
        self.unroute(Routes.CATEGORY, handler_function)

    def route_autocomplete(self, handler_function: Callable) -> None:
        self.route(Routes.AUTOCOMPLETE, handler_function)

    def unroute_autocomplete(
        self, handler_function: Optional[Callable] = None
    ) -> None:
        self.unroute(Routes.AUTOCOMPLETE, handler_function)

    def route_vocabs(self, handler_function: Callable) -> None:
        self.route(Routes.VOCABS, handler_function)

    def unroute_vocabs(
        self, handler_function: Optional[Callable] = None
    ) -> None:
        self.unroute(Routes.VOCABS, handler_function)

    def route_search_collections(
        self,
        temporal_handler: Callable,
        provider_handler: Callable,
    ) -> None:
        self.route(Routes.COLLECTION_TEMPORAL, temporal_handler)
        self.route(Routes.COLLECTION_PROVIDER, provider_handler)

    def unroute_search_collections(
        self,
        temporal_handler: Optional[Callable] = None,
        provider_handler: Optional[Callable] = None,
    ) -> None:
        self.unroute(Routes.COLLECTION_TEMPORAL, temporal_handler)
        self.unroute(Routes.COLLECTION_PROVIDER, provider_handler)

    def route_collection(
        self,
        centroid_handler: Callable,
        all_handler: Callable,
        popup_handler: Optional[Callable] = None,
    ) -> None:
        self.route(Routes.COLLECTION_CENTROID, centroid_handler)
        self.route(Routes.COLLECTION_ALL, all_handler)
        if popup_handler is not None:
            self.route(Routes.COLLECTION_POPUP, popup_handler)
            self.route(Routes.COLLECTION_SELECTED, popup_handler)

    def unroute_collection(
        self,
        centroid_handler: Optional[Callable] = None,
        all_handler: Optional[Callable] = None,
        popup_handler: Optional[Callable] = None,
    ) -> None:
        self.unroute(Routes.COLLECTION_CENTROID, centroid_handler)
        self.unroute(Routes.COLLECTION_ALL, all_handler)
        self.unroute(Routes.COLLECTION_POPUP, popup_handler)
        self.unroute(Routes.COLLECTION_SELECTED, popup_handler)

    def route_collection_all(self, handler_function: Callable) -> None:
        self.route(Routes.COLLECTION_ALL, handler_function)

    def route_collection_detail(
        self, detail_handler: Callable, detail_item_handler: Callable
    ) -> None:
        self.route(Routes.COLLECTION_DETAIL, detail_handler)
        self.route(Routes.COLLECTION_DETAIL_ITEM, detail_item_handler)

    def unroute_collection_detail(
        self,
        detail_handler: Optional[Callable] = None,
        detail_item_handler: Optional[Callable] = None,
    ) -> None:
        self.unroute(Routes.COLLECTION_DETAIL, detail_handler)
        self.unroute(Routes.COLLECTION_DETAIL_ITEM, detail_item_handler)

    def route_geowebcache(self, handler_function: Callable) -> None:
        self.route(Routes.GEOWEBCACHE, handler_function)

    def unroute_geowebcache(
        self, handler_function: Optional[Callable] = None
    ) -> None:
        self.unroute(Routes.GEOWEBCACHE, handler_function)

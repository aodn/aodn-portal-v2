import type { createBrowserRouter } from "react-router-dom";

type Router = ReturnType<typeof createBrowserRouter>;

const CANONICAL_BASE_URL = "https://portal.aodn.org.au";

const setCanonicalUrl = (pathname: string) => {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = `${CANONICAL_BASE_URL}${pathname}`;
};

export const syncCanonicalUrl = (router: Router) => {
  setCanonicalUrl(router.state.location.pathname);
  router.subscribe((state) => setCanonicalUrl(state.location.pathname));
};

import type { createBrowserRouter } from "react-router-dom";

type Router = ReturnType<typeof createBrowserRouter>;

// v2 is currently served from portal-beta. When it takes over the production
// domain, update this, SitemapUtils.js and robots.prod.txt together.
export const CANONICAL_BASE_URL = "https://portal-beta.aodn.org.au";

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

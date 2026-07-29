import type { createBrowserRouter } from "react-router-dom";
import { BASE_URL } from "./constants";

type Router = ReturnType<typeof createBrowserRouter>;

const setCanonicalUrl = (pathname: string) => {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = `${BASE_URL}${pathname}`;
};

export const syncCanonicalUrl = (router: Router) => {
  setCanonicalUrl(router.state.location.pathname);
  router.subscribe((state) => setCanonicalUrl(state.location.pathname));
};

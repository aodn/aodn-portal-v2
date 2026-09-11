import { Fragment, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/common/scroll/ScrollToTop";
import { Outlet, useLocation } from "react-router-dom";
import { trackPageResponseTime } from "@/analytics/pageResTimeEvent";
import { trackWebVitals } from "@/analytics/webVitalsEvents";
import { pageDefault } from "@/components/common/constants";

const SEARCH_PAGE_NO_SCROLL_CLASS = "search-page-no-scroll";

const Layout = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === pageDefault.search;
  // The detail page renders its shell immediately and fills it once the record
  // arrives. With only flex:1 the footer lands just inside the fold and then
  // gets pushed down, which measured 0.344 CLS on its own -- a quarter of the
  // mobile Lighthouse score. Reserving a viewport starts the footer below the
  // fold, where that growth no longer counts as a shift. Scoped to this route
  // deliberately: doing it globally added ~590px of trailing whitespace to a
  // short page like downloads.
  const isDetailsPage = location.pathname.startsWith(`${pageDefault.details}/`);

  // This Layout wraps all pages - any effects here run globally on every route change
  useEffect(() => {
    // 🎯 page response time tracking
    trackPageResponseTime();
    // 🎯 web vitals tracking
    trackWebVitals();
  }, [location.pathname]);

  // Hide the always-on body scrollbar gutter on search (see index.css).
  useEffect(() => {
    document.body.classList.toggle(SEARCH_PAGE_NO_SCROLL_CLASS, isSearchPage);
    return () => {
      document.body.classList.remove(SEARCH_PAGE_NO_SCROLL_CLASS);
    };
  }, [isSearchPage]);

  return (
    <Fragment>
      <ScrollToTop />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          // Search is a fixed viewport (map + list). Other pages may grow and scroll.
          ...(isSearchPage && { height: { md: "100vh" } }),
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            ...(isDetailsPage && { minHeight: "100vh" }),
            ...(isSearchPage && {
              minHeight: { md: 0 },
              overflow: { md: "hidden" },
            }),
          }}
        >
          <Outlet />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Footer />
        </Box>
      </Box>
    </Fragment>
  );
};

export default Layout;

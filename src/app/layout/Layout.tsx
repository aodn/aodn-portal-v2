import { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// TODO: Temp works but need to check user locale on date time format
import "dayjs/locale/en-gb";
import dayjs from "@/utils/dayjs";
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
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={"en-gb"}
      dateLibInstance={dayjs}
    >
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
    </LocalizationProvider>
  );
};

export default Layout;

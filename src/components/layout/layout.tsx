import React, { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// TODO: Temp works but need to check user locale on date time format
import "dayjs/locale/en-gb";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "../common/scroll/ScrollToTop";
import { useLocation } from "react-router-dom";
import { trackPageResponseTime } from "../../analytics/pageResTimeEvent";
import { trackWebVitals } from "../../analytics/webVitalsEvents";
import SEO from "../common/seo/SEO";

interface LayoutProps {}

const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  const location = useLocation();

  // This Layout wraps all pages - any effects here run globally on every route change
  useEffect(() => {
    // 🎯 page response time tracking
    trackPageResponseTime();
    // 🎯 web vitals tracking
    trackWebVitals();
  }, [location.pathname]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
      <SEO />
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </LocalizationProvider>
  );
};

export default Layout;

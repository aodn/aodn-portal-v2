import { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// TODO: Temp works but need to check user locale on date time format
import "dayjs/locale/en-gb";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/common/scroll/ScrollToTop";
import { Outlet, useLocation } from "react-router-dom";
import { trackPageResponseTime } from "@/analytics/pageResTimeEvent";
import { trackWebVitals } from "@/analytics/webVitalsEvents";

const Layout = () => {
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
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </LocalizationProvider>
  );
};

export default Layout;

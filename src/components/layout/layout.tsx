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

interface LayoutProps {}

const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  const location = useLocation();

  useEffect(() => {
    // 🎯 page response time tracking
    trackPageResponseTime();
  }, [location.pathname]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </LocalizationProvider>
  );
};

export default Layout;

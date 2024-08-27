import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// TODO: Temp works but need to check user locale on date time format
import "dayjs/locale/en-gb";
import Header from "../header/header";
import Footer from "../footer/footer";

interface LayoutProps {}

const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
      <Header isLandingPage={location.pathname == "/"} />
      <main>{children}</main>
      <Footer />
    </LocalizationProvider>
  );
};

export default Layout;

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// TODO: Temp works but need to check user locale on date time format
import "dayjs/locale/en-gb";
import Header from "./components/Header";
import Footer from "./components/Footer";

interface LayoutProps {}

const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
        <Header />
        <main>{children}</main>
        <Footer />
      </LocalizationProvider>
    </div>
  );
};

export default Layout;

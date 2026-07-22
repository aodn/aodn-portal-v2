// React import is not required in React 17 or later
import { RouterProvider } from "react-router-dom";
import Fallback from "@/pages/error-page/Fallback";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import AppRouter from "@/app/router";
import { CssBaseline } from "@mui/material";
import Scrollbar from "@/components/common/scroll/ScrollBar";
import GlobalLoader from "@/components/loading/GlobalLoader";
import AdminScreen from "@/components/admin/AdminScreen";
import { ClipboardProvider } from "@/app/providers/ClipboardProvider";
import { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Turn on dayjs timezone support
extend(utc);
extend(timezone);

const app = () => {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <Scrollbar />
      <GlobalLoader>
        <ClipboardProvider>
          <AdminScreen>
            <RouterProvider router={AppRouter} fallbackElement={<Fallback />} />
          </AdminScreen>
        </ClipboardProvider>
      </GlobalLoader>
    </ThemeProvider>
  );
};

export default app;

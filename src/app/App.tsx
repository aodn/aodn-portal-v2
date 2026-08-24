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

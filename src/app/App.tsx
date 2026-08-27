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
import { AppLocalizationProvider } from "@/app/providers/AppLocalizationProvider";

const app = () => {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <AppLocalizationProvider>
        <Scrollbar />
        <GlobalLoader>
          <ClipboardProvider>
            <AdminScreen>
              <RouterProvider
                router={AppRouter}
                fallbackElement={<Fallback />}
              />
            </AdminScreen>
          </ClipboardProvider>
        </GlobalLoader>
      </AppLocalizationProvider>
    </ThemeProvider>
  );
};

export default app;

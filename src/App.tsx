// React import is not required in React 17 or later
import { RouterProvider } from "react-router-dom";
import Fallback from "./pages/Fallback";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "./utils/AppTheme";
import AppRouter from "./utils/AppRouter";
import { CssBaseline } from "@mui/material";
import Scrollbar from "./components/common/scroll/ScrollBar";
import GlobalLoader from "./components/loading/GlobalLoader";
import AdminScreen from "./components/admin/AdminScreen";
import { ClipboardProvider } from "./context/clipboard/ClipboardProvider";

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

// React import is not required in React 17 or later
import { RouterProvider } from "react-router-dom";
import Fallback from "./pages/Fallback";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "./utils/AppTheme";
import AppRouter from "./utils/AppRouter";
import { CssBaseline } from "@mui/material";
import Scrollbar from "./components/common/ScrollBar";
import LoadingManager from "./components/loading/LoadingManager";

const app = () => {
  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <LoadingManager>
          <CssBaseline />
          <Scrollbar />
          <RouterProvider router={AppRouter} fallbackElement={<Fallback />} />
        </LoadingManager>
      </ThemeProvider>
    </div>
  );
};

export default app;

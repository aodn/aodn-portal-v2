// React import is not required in React 17 or later
import { RouterProvider } from "react-router-dom";
import Fallback from "./pages/Fallback";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "./utils/AppTheme";
import AppRouter from "./utils/AppRouter";
import { CssBaseline } from "@mui/material";
import Scrollbar from "./components/common/ScrollBar";
import GlobalLoader from "./components/loading/GlobalLoader";

const app = () => {
  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <CssBaseline />
        <Scrollbar />
        <GlobalLoader>
          <RouterProvider router={AppRouter} fallbackElement={<Fallback />} />
        </GlobalLoader>
      </ThemeProvider>
    </div>
  );
};

export default app;

// React import is not required in React 17 or later
import { RouterProvider } from "react-router-dom";
import Fallback from "./pages/Fallback";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "./utils/AppTheme";
import AppRouter from "./utils/AppRouter";
import { CssBaseline } from "@mui/material";
import Scrollbar from "./components/common/ScrollBar";

const app = () => {
  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <CssBaseline />
        <Scrollbar />
        <RouterProvider router={AppRouter} fallbackElement={<Fallback />} />
      </ThemeProvider>
    </div>
  );
};

export default app;

import "./App.css";
import { RouterProvider } from "react-router-dom";

import Fallback from "./pages/Fallback";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "./utils/AppTheme";
import AppRouter from "./utils/AppRouter";

const app = () => {
  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <RouterProvider router={AppRouter} fallbackElement={<Fallback />} />
      </ThemeProvider>
    </div>
  );
};

export default app;

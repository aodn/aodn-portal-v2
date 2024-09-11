import { Alert, Snackbar, useTheme } from "@mui/material";
import React from "react";

interface SnackbarLoaderProps {
  isLoading: boolean;
  message: string;
}

const SnackbarLoader: React.FC<SnackbarLoaderProps> = ({
  isLoading,
  message,
}) => {
  const theme = useTheme();
  return (
    <Snackbar
      open={isLoading}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      // message={"Loading"}
      sx={{
        ml: theme.mp.xxlg,
        position: "absolute",
      }}
    >
      <Alert
        severity="info"
        variant="outlined"
        color={"info"}
        sx={{ width: "100%", bgcolor: "white" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarLoader;

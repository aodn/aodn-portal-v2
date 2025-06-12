import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

interface ValidationSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
  isMobile?: boolean;
}

export const ValidationSnackbar: React.FC<ValidationSnackbarProps> = ({
  snackbar,
  onClose,
  isMobile = false,
}) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{
          width: "100%",
          "& .MuiAlert-message": {
            fontSize: isMobile ? "0.875rem" : "1rem",
          },
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

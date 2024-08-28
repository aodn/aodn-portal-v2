import { Paper } from "@mui/material";
import { borderRadius, margin } from "../../../styles/constants";
import React from "react";

interface StyledActionButtonPaperProps {}

const ActionButtonPaper = ({
  children,
}: React.PropsWithChildren<StyledActionButtonPaperProps>) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderRadius: borderRadius.medium,
      }}
    >
      {children}
    </Paper>
  );
};

export default ActionButtonPaper;

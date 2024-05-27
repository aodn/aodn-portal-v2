import { Paper } from "@mui/material";
import { margin } from "../../../styles/constants";
import React from "react";

interface StyledActionButtonPaperProps {
  children: React.ReactNode;
}

const ActionButtonPaper: React.FC<StyledActionButtonPaperProps> = ({
  children,
}) => {
  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{
        p: "2px 14px",
        marginLeft: margin.xSmall,
        display: "flex",
        alignItems: "center",
        width: { md: "50px" },
      }}
    >
      {children}
    </Paper>
  );
};

export default ActionButtonPaper;

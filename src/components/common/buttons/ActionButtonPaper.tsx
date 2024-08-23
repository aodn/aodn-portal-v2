import { Paper } from "@mui/material";
import { margin } from "../../../styles/constants";
import React from "react";

interface StyledActionButtonPaperProps {}

const ActionButtonPaper = ({
  children,
}: React.PropsWithChildren<StyledActionButtonPaperProps>) => {
  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{
        paddingLeft: "5px",
        marginLeft: margin.md,
        display: "flex",
        alignItems: "center",
        maxHeight: "40px",
        width: { md: "100px" },
      }}
    >
      {children}
    </Paper>
  );
};

export default ActionButtonPaper;

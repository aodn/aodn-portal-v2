import { Grid, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface SubPanelProps {
  title: string;
  children: ReactNode;
}

const SubPanel: React.FC<SubPanelProps> = ({ title, children }) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={12} display="flex" alignItems="center">
        <KeyboardDoubleArrowRightIcon />
        <Typography display="inline" variant="h3" sx={{ paddingTop: "0px" }}>
          {title}
        </Typography>
      </Grid>
      <Grid item container md={12}>
        {children}
      </Grid>
    </Grid>
  );
};

export default SubPanel;

import React from "react";
import { Grid, Typography } from "@mui/material";

interface TextAreaProps {
  children: React.ReactNode;
}

const TextArea: React.FC<TextAreaProps> = ({ children }) => {
  return (
    <Grid item md={12}>
      <Typography variant="detailContent">{children}</Typography>
    </Grid>
  );
};

export default TextArea;

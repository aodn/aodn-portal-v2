import React from "react";
import { Grid, Typography, useTheme } from "@mui/material";

interface TextAreaProps {
  children: React.ReactNode;
}

const TextArea: React.FC<TextAreaProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <Grid item md={12} sx={{ marginTop: theme.mp.sm }}>
      <Typography variant="detailContent">{children}</Typography>
    </Grid>
  );
};

export default TextArea;

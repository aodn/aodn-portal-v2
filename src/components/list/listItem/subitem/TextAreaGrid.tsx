import React from "react";
import { Grid, GridProps, useTheme } from "@mui/material";
interface TextAreaGridProps extends GridProps {
  children: React.ReactNode;
}
const TextAreaGrid: React.FC<TextAreaGridProps> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Grid
      item
      md={12}
      sx={{
        marginTop: theme.mp.sm,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

export default TextAreaGrid;

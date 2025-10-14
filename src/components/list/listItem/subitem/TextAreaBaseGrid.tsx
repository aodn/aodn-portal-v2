import React from "react";
import { Grid, GridProps, SxProps, Theme } from "@mui/material";
interface TextAreaGridProps extends GridProps {
  sx?: SxProps<Theme>;
}

const TextAreaBaseGrid = ({
  children,
  sx,
  ...props
}: React.PropsWithChildren<TextAreaGridProps>) => {
  return (
    <Grid item sx={sx} {...props}>
      {children}
    </Grid>
  );
};

export default TextAreaBaseGrid;

import React from "react";
import { Grid, GridProps, SxProps, Theme, useTheme } from "@mui/material";
interface TextAreaGridProps extends GridProps {
  sx?: SxProps<Theme>;
}

const TextAreaBaseGrid = ({
  children,
  sx,
  ...props
}: React.PropsWithChildren<TextAreaGridProps>) => {
  const theme = useTheme();
  return (
    <Grid
      item
      sx={{
        my: theme.mp.sm,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

export default TextAreaBaseGrid;

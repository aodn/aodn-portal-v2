import { useCallback, useEffect, useState } from "react";
import { Grid, Box, SxProps, Theme } from "@mui/material";
import { borderRadius } from "../constants";
import blue from "../colors/blue";

interface DepthFiltersProps {
  sx?: SxProps<Theme>;
}

const DepthFilter = (props: DepthFiltersProps) => {
  return (
    <Grid
      container
      sx={{
        backgroundColor: blue["bgParam"],
        border: "none",
        borderRadius: borderRadius["filter"],
        justifyContent: "center",
        minHeight: "90px",
        ...props.sx,
      }}
    >
      <Grid item xs={12}>
        Depth
      </Grid>
    </Grid>
  );
};

export default DepthFilter;

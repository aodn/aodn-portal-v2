import { Grid } from "@mui/material";
import React from "react";
import { margin } from "../../../../styles/constants";

interface PlainTextFragmentProps {
  children: React.ReactNode;
}

const PlainTextFragment: React.FC<PlainTextFragmentProps> = ({ children }) => {
  return (
    <Grid
      container
      sx={{
        width: "98%",
        backgroundColor: "#F2F6F9",
        margin: margin.lg,
        borderRadius: "var(----s, 4px)",
        color: "#676767",
        fontFamily: "Noto Sans",
      }}
    >
      <Grid item md={12}>
        <Grid container>
          <Grid item md={1} />
          <Grid item md={11}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default PlainTextFragment;

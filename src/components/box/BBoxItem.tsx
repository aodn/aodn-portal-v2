import React from "react";
import { Grid, Typography } from "@mui/material";
import _ from "lodash";

interface BBoxItemProps {
  label: string;
  value: number;
}

const BBoxItem: React.FC<BBoxItemProps> = ({ label, value }) => {
  const roundedValue = _.round(value, 2);
  return (
    <Grid item md={5}>
      <Typography
        sx={{
          color: "#7194AB",
          fontSize: "12px",
          fontWeight: "400",
          lineHeight: "8px",
        }}
      >
        {label}: {roundedValue}
      </Typography>
    </Grid>
  );
};

export default BBoxItem;

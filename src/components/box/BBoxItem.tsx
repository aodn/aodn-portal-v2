import React from "react";
import { Typography } from "@mui/material";
import _ from "lodash";

interface BBoxItemProps {
  label: string;
  value: number;
}

const BBoxItem: React.FC<BBoxItemProps> = ({ label, value }) => {
  const roundedValue = _.round(value, 2);
  return (
    <Typography
      sx={{
        color: "#7194AB",
        fontSize: "12px",
        fontWeight: "400",
        lineHeight: "8px",
        padding: 0,
      }}
    >
      {label}: {roundedValue}
    </Typography>
  );
};

export default BBoxItem;

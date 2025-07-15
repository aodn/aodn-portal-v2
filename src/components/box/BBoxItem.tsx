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
        color: "#090C02",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "22px",
        padding: 0,
      }}
    >
      {label}: {roundedValue}
    </Typography>
  );
};

export default BBoxItem;

import React from "react";
import { Typography } from "@mui/material";
import _ from "lodash";
import { portalTheme } from "../../styles";

interface BBoxItemProps {
  label: string;
  value: number;
}

const BBoxItem: React.FC<BBoxItemProps> = ({ label, value }) => {
  const roundedValue = _.round(value, 2);
  return (
    <Typography
      sx={{
        ...portalTheme.typography.body2Regular,
        color: portalTheme.palette.text2,
        padding: 0,
      }}
    >
      {label}: {roundedValue}
    </Typography>
  );
};

export default BBoxItem;

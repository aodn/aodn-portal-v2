import React from "react";
import { Typography } from "@mui/material";
import _ from "lodash";
import rc8Theme from "../../styles/themeRC8";

interface BBoxItemProps {
  label: string;
  value: number;
}

const BBoxItem: React.FC<BBoxItemProps> = ({ label, value }) => {
  const roundedValue = _.round(value, 2);
  return (
    <Typography
      sx={{
        ...rc8Theme.typography.body2Regular,
        color: rc8Theme.palette.text2,
        padding: 0,
      }}
    >
      {label}: {roundedValue}
    </Typography>
  );
};

export default BBoxItem;

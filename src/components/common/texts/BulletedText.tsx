import { Box, Typography } from "@mui/material";
import React from "react";

interface BulletedTextProps {
  children: string;
}

const BulletedText: React.FC<BulletedTextProps> = ({ children }) => {
  return (
    <Box>
      <Typography variant="body1">
        {" \u2022 "} {children}
      </Typography>
    </Box>
  );
};

export default BulletedText;

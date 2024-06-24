import React from "react";
import { Box, Button } from "@mui/material";

interface DetailSubtabProps {
  title: string;
  navigate: () => void;
  isBordered: boolean;
}

const DetailSubtabBtn: React.FC<DetailSubtabProps> = ({
  title,
  navigate,
  isBordered,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      sx={{
        height: "45px",
        marginX: "20px",
      }}
    >
      <Button
        sx={{
          minWidth: 0,
          border: isBordered
            ? " 1px solid var(--brand_dark-blue_80, #618CA5)"
            : "none",
          borderRadius: "5px",
        }}
        onClick={navigate}
      >
        {title}
      </Button>
    </Box>
  );
};

export default DetailSubtabBtn;

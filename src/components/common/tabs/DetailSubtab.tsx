import React from "react";
import { Box, Button } from "@mui/material";

interface DetailSubtabProps {
  title: string;
  selectedTab: string;
}

const DetailSubtab: React.FC<DetailSubtabProps> = ({ title, selectedTab }) => {
  const isSelected = selectedTab === title;
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      sx={{
        marginX: "20px",
        border: isSelected
          ? " 1px solid var(--brand_dark-blue_80, #618CA5)"
          : "none",
        borderRadius: "5px",
      }}
    >
      <Button sx={{ minWidth: 0 }}>{title}</Button>
    </Box>
  );
};

export default DetailSubtab;

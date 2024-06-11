import React from "react";
import { Box, Button } from "@mui/material";

interface DetailSubtabProps {
  title: string;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const DetailSubtab: React.FC<DetailSubtabProps> = ({
  title,
  selectedTab,
  setSelectedTab,
}) => {
  const isSelected = selectedTab === title;
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
          border: isSelected
            ? " 1px solid var(--brand_dark-blue_80, #618CA5)"
            : "none",
          borderRadius: "5px",
        }}
        onClick={() => setSelectedTab(title)}
      >
        {title}
      </Button>
    </Box>
  );
};

export default DetailSubtab;

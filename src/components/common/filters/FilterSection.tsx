import StyledFilterSectionGrid from "../../../styles/StyledFilterSectionGrid";
import { Typography } from "@mui/material";
import React from "react";

interface FilterSectionContainerProps {
  title: string;
  children: React.ReactNode;
  isTitleOnlyHeader?: boolean;
}

const FilterSection: React.FC<FilterSectionContainerProps> = ({
  title,
  children,
  isTitleOnlyHeader = false,
}) => {
  return (
    <StyledFilterSectionGrid
      padding={!title ? "0px" : "10px"}
      sx={{
        position: "relative",
        paddingTop: isTitleOnlyHeader ? "3rem" : undefined,
      }}
    >
      <Typography
        variant="h3"
        sx={{ position: "absolute", left: "2rem", top: "0.7rem", padding: 0 }}
      >
        {title}
      </Typography>
      {children}
    </StyledFilterSectionGrid>
  );
};

export default FilterSection;

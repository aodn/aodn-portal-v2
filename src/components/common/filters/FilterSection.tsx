import StyledFilterSectionGrid from "../../../styles/StyledFilterSectionGrid.tsx";
import { Box, Typography } from "@mui/material";
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
      isSmall={title ? undefined : "true"}
      sx={{
        position: "relative",
        paddingTop: isTitleOnlyHeader ? "3rem" : undefined,
      }}
    >
      {title && (
        <Typography
          variant="h3"
          sx={{ position: "absolute", left: "2rem", top: "0.7rem" }}
        >
          {title}
        </Typography>
      )}

      {children}
    </StyledFilterSectionGrid>
  );
};

export default FilterSection;

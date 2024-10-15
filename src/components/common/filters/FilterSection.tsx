import { FC, ReactNode } from "react";
import StyledFilterSectionGrid from "./StyledFilterSectionGrid";
import { Tooltip, Typography } from "@mui/material";
import { gap, padding } from "../../../styles/constants";

interface FilterSectionContainerProps {
  title: string;
  children: ReactNode;
  isTitleOnlyHeader?: boolean;
  toolTip?: string;
}

const FilterSection: FC<FilterSectionContainerProps> = ({
  title,
  children,
  isTitleOnlyHeader = false,
  toolTip,
}) => {
  return (
    <StyledFilterSectionGrid
      padding={!title ? "0px" : "10px"}
      sx={{
        position: "relative",
        paddingTop: isTitleOnlyHeader ? padding.triple : 0,
      }}
    >
      <Tooltip title={toolTip} placement="top">
        <Typography
          variant="h3"
          sx={{
            position: "absolute",
            left: gap.xxlg,
            top: gap.xlg,
            padding: 0,
          }}
        >
          {title}
        </Typography>
      </Tooltip>
      {children}
    </StyledFilterSectionGrid>
  );
};

export default FilterSection;

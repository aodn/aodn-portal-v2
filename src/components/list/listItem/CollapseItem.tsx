import React, { ReactNode, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import StyledItemGrid from "./StyledItemGrid";
import CollapseItemTitle from "./subitem/CollapseItemTitle";
import CollapseBtn from "./subitem/CollapseBtn";

interface CollapseItemProps {
  title?: string;
  children: ReactNode;
  isOpen?: boolean;
}

const CollapseItem: React.FC<CollapseItemProps> = ({
  title = "",
  children,
  isOpen = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <StyledItemGrid container data-testid="collapseItem">
      <CollapseItemTitle
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        expanded={isExpanded}
        title={title}
      />
      <CollapseBtn
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        expanded={isExpanded}
      />

      <Grid item md={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </StyledItemGrid>
  );
};

export default CollapseItem;

import React, { ReactNode, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import ItemBaseGrid from "./ItemBaseGrid";
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
    <ItemBaseGrid container data-testid="collapseItem">
      <Grid item md={11} sx={{ alignSelf: "center" }}>
        <CollapseItemTitle setIsExpanded={setIsExpanded} text={title} />
      </Grid>
      <Grid item md={1}>
        <CollapseBtn isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </Grid>
      <Grid item md={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseItem;

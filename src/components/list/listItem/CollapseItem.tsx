import React, { ReactNode, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import ItemBaseGrid from "./ItemBaseGrid";
import CollapseItemTitle from "./subitem/CollapseItemTitle";
import CollapseBtn from "./subitem/CollapseBtn";
import rc8Theme from "../../../styles/themeRC8";

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
      <Grid item xs={11} sx={{ alignSelf: "center" }}>
        <CollapseItemTitle setIsExpanded={setIsExpanded} text={title} />
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          pt: "5px",
        }}
      >
        <CollapseBtn
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          iconColor={rc8Theme.palette.text2}
        />
      </Grid>
      <Grid item xs={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseItem;

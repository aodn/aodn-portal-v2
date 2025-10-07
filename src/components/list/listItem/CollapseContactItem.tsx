import React, { useState } from "react";
import ItemBaseGrid from "./ItemBaseGrid";
import { Collapse, Grid } from "@mui/material";
import CollapseContactItemTitle from "./subitem/CollapseContactItemTItle";
import CollapseBtn from "./subitem/CollapseBtn";
import rc8Theme from "../../../styles/themeRC8";

interface CollapseContactItemProps {
  title: string;
  children: React.ReactNode;
  email: string;
}

const CollapseContactItem: React.FC<CollapseContactItemProps> = ({
  children,
  email,
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ItemBaseGrid container data-testid="collapseItem">
      <Grid item xs={11} sx={{ alignSelf: "center" }}>
        <CollapseContactItemTitle
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          email={email}
          text={title}
        />
      </Grid>
      <Grid item xs={1}>
        <CollapseBtn
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          iconColor={rc8Theme.palette.text2}
        />
      </Grid>

      <Grid item xs={12}>
        <Collapse in={isExpanded}>
          <Grid container item md={12}>
            {children ? children : "[ NO CONTENT ]"}
          </Grid>
        </Collapse>
      </Grid>
    </ItemBaseGrid>
  );
};

export default CollapseContactItem;

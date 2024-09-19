import React, { useState } from "react";
import StyledItemGrid from "./StyledItemGrid";
import { Collapse, Grid, IconButton } from "@mui/material";
import CollapseItemTitle from "./subitem/CollapseItemTitle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface CollapseContactItemProps {
  title: string;
  children: React.ReactNode;
  email: string;
  isOpen?: boolean;
}

// TODO: just deconstruct this from the CollapseItem for the possible future changes.
//  so please ignore the duplicate lines between this component with the CollapseItem.
const CollapseContactItem: React.FC<CollapseContactItemProps> = ({
  isOpen = false,
  children,
  email,
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <StyledItemGrid container data-testid="collapseItem">
      <Grid
        item
        md={11}
        sx={{
          alignSelf: "center",
        }}
      >
        <CollapseItemTitle
          onClick={() => {
            if (isExpanded) {
              return null;
            }
            setIsExpanded(!isExpanded);
          }}
          isContact={true}
          expanded={isExpanded}
          email={email}
          title={title}
        />
      </Grid>
      <Grid
        item
        md={1}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          aria-label="expand or collapse"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Grid>

      <Grid item md={12}>
        <Collapse in={isExpanded}>
          <Grid container>
            <Grid item md={12}>
              {children ? children : "[ NO CONTENT ]"}
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </StyledItemGrid>
  );
};

export default CollapseContactItem;

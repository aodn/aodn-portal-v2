import React, { useState } from "react";
import StyledItemGrid from "../StyledItemGrid";
import { Collapse, Grid, IconButton, Typography } from "@mui/material";
import CollapseItemBtn from "../../../common/buttons/CollapseItemBtn";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface CollapseContactItemProps {
  isOpen?: boolean;
  children: React.ReactNode;
  email: string;
  title: string;
}

const CollapseContactItem: React.FC<CollapseContactItemProps> = ({
  isOpen = false,
  children,
  email,
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const titleComponent = () => {
    return (
      <Typography variant="detailTitle">
        {title ? title : "[ NO TITLE ]"}
      </Typography>
    );
  };

  return (
    <StyledItemGrid container data-testid="collapseItem">
      <Grid
        item
        md={11}
        sx={{
          alignSelf: "center",
        }}
      >
        <CollapseItemBtn
          onClick={() => {
            if (isExpanded) {
              return null;
            }
            setIsExpanded(!isExpanded);
          }}
          isContact={true}
          expanded={isExpanded}
          email={email}
          element={titleComponent()}
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

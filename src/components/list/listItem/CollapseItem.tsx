import React, { ReactNode, useState } from "react";
import { Collapse, Grid, IconButton, Typography } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StyledItemGrid from "./StyledItemGrid";
import CollapseItemBtn from "../../common/buttons/CollapseItemBtn";

interface CollapseFrameProps {
  title: string;
  children: ReactNode;
  isContact?: boolean;
  isAssociatedRecord?: boolean;
  isOpen?: boolean;
  email?: string;
}

const CollapseItem: React.FC<CollapseFrameProps> = ({
  title,
  children,
  isContact = false,
  isAssociatedRecord = false,
  isOpen = false,
  email,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const titleComponent = () => {
    return <Typography variant="detailTitle">{title}</Typography>;
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
            if (isContact && isExpanded) {
              return null;
            }
            setIsExpanded(!isExpanded);
          }}
          isContact={isContact}
          isAssociatedRecord={isAssociatedRecord}
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
              {children}
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </StyledItemGrid>
  );
};

export default CollapseItem;

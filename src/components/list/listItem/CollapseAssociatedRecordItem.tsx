import React, { ReactNode, useState } from "react";
import StyledItemGrid from "./StyledItemGrid";
import { ButtonBase, Collapse, Grid, Typography } from "@mui/material";
import CollapseBtn from "./subitem/CollapseBtn";
import TiltedChainIcon from "../../icon/TiltedChainIcon";

interface CollapseAssociatedRecordItemProps {
  title: string;
  titleAction: () => void;
  children: ReactNode;
}

const CollapseAssociatedRecordItem: React.FC<
  CollapseAssociatedRecordItemProps
> = ({ title, titleAction, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StyledItemGrid container>
      <Grid
        item
        md={11}
        sx={{
          alignSelf: "center",
        }}
      >
        <ButtonBase
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ width: "100%" }}
        >
          <Grid item container md={12}>
            <Grid
              item
              md={1}
              onClick={titleAction}
              sx={{ alignSelf: "center", justifySelf: "center" }}
            >
              <TiltedChainIcon />
            </Grid>

            <Grid
              item
              md={11}
              sx={{
                textAlign: "left",
                whiteSpace: "normal",
              }}
            >
              <Typography variant="detailTitle">
                {title ? title : "[ NO TITLE ]"}
              </Typography>
            </Grid>
          </Grid>
        </ButtonBase>
      </Grid>
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

export default CollapseAssociatedRecordItem;

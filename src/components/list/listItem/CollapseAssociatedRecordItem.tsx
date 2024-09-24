import React, { ReactNode, useState } from "react";
import { useHoverContext } from "./ItemBaseGrid";
import { Collapse, Grid, Typography, useTheme } from "@mui/material";
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

  const { isOnHover } = useHoverContext();
  const theme = useTheme();

  return (
    <Grid container>
      <Grid
        item
        md={11}
        sx={{
          alignSelf: "center",
        }}
      >
        <Grid item container md={12} onClick={() => setIsExpanded(!isExpanded)}>
          <Grid
            item
            md={1}
            onClick={titleAction}
            sx={{
              alignSelf: "center",
              cursor: "pointer",
            }}
          >
            <TiltedChainIcon />
          </Grid>

          <Grid item md={11}>
            <Typography
              variant="detailTitle"
              sx={{ color: isOnHover ? theme.palette.primary.main : "inherit" }}
            >
              {title ? title : "[ NO TITLE ]"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <CollapseBtn setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
      <Grid item md={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default CollapseAssociatedRecordItem;

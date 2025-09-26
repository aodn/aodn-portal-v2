import React, { ReactNode, useState } from "react";
import { useHoverContext } from "./ItemBaseGrid";
import { Collapse, Grid, Typography, useTheme } from "@mui/material";
import CollapseBtn from "./subitem/CollapseBtn";
import TiltedChainIcon from "../../icon/TiltedChainIcon";
import rc8Theme from "../../../styles/themeRC8";

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
    <Grid container>
      <Grid
        item
        xs={11}
        sx={{
          alignSelf: "center",
        }}
      >
        <Grid
          item
          container
          xs={12}
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid={`collapse-item-${title}`}
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Grid
            item
            xs={2}
            md={1}
            onClick={titleAction}
            sx={{
              cursor: "pointer",
              pt: "5px",
            }}
          >
            <TiltedChainIcon />
          </Grid>

          <Grid item xs={10}>
            <Typography
              sx={{
                ...rc8Theme.typography.title1Medium,
                color: rc8Theme.palette.primary1,
                pt: "5px",
              }}
            >
              {title ? title : "[ NO TITLE ]"}
            </Typography>
          </Grid>
        </Grid>
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
        <CollapseBtn setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
      </Grid>
      <Grid item xs={12}>
        <Collapse in={isExpanded}>
          {children ? children : "[ NO CONTENT ]"}
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default CollapseAssociatedRecordItem;

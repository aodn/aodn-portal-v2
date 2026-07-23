import React, { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";
import LabelChip from "../../../common/label/LabelChip";
import { portalTheme } from "../../../../styles";

interface CollapseItemTitleProps {
  text: string;
  titleComponent?: ReactNode;
  labels?: string[];
}

const CollapseItemTitle: React.FC<CollapseItemTitleProps> = ({
  text,
  titleComponent,
  labels,
}) => {
  return (
    <Grid
      item
      container
      xs={12}
      data-testid={
        text && text.length > 0 ? `collapse-item-${text}` : undefined
      }
    >
      {titleComponent ? (
        titleComponent
      ) : (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              minHeight: "100%",
              whiteSpace: "normal",
              ...portalTheme.typography.title1Medium,
              p: 0,
            }}
          >
            {text ? text : "[ NO TITLE ]"}
          </Typography>
          {labels && labels.length > 0 && <LabelChip text={labels} />}
        </Grid>
      )}
    </Grid>
  );
};

export default CollapseItemTitle;

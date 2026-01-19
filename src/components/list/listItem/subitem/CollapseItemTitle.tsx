import React, { ReactNode } from "react";
import { Box, Grid, Typography } from "@mui/material";
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
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              display: "inline-block",
              textAlign: "left",
              whiteSpace: "normal",
              ...portalTheme.typography.title1Medium,
              p: 0,
              my: "8px",
              mx: "6px",
            }}
          >
            {text ? text : "[ NO TITLE ]"}
          </Typography>
          {labels && labels.length > 0 && (
            <Box display="inline-block">
              <LabelChip text={labels} />
            </Box>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default CollapseItemTitle;

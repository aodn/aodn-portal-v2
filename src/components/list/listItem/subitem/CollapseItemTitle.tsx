import React, { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";
import { portalTheme } from "../../../../styles";

interface CollapseItemTitleProps {
  text: string;
  titleComponent?: ReactNode;
}

const CollapseItemTitle: React.FC<CollapseItemTitleProps> = ({
  text,
  titleComponent,
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
          md={11}
          sx={{
            textAlign: "left",
            whiteSpace: "normal",
          }}
        >
          <Typography
            sx={{
              ...portalTheme.typography.title1Medium,
              p: 0,
              my: "8px",
              mx: "6px",
            }}
          >
            {text ? text : "[ NO TITLE ]"}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default CollapseItemTitle;

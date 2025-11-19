import React, { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";
import rc8Theme from "../../../../styles/themeRC8";

interface CollapseItemTitleProps {
  text: string;
  titleComponent?: ReactNode;
}

const CollapseItemTitle: React.FC<CollapseItemTitleProps> = ({
  text,
  titleComponent,
}) => {
  return (
    <Grid item container xs={12} data-testid={`collapse-item-${text}`}>
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
              ...rc8Theme.typography.title1Medium,
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

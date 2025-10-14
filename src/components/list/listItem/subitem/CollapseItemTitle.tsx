import React from "react";
import { Grid, Typography } from "@mui/material";
import rc8Theme from "../../../../styles/themeRC8";

interface CollapseItemTitleProps {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  color: string;
}

const CollapseItemTitle: React.FC<CollapseItemTitleProps> = ({
  setIsExpanded,
  text,
  color,
}) => {
  return (
    <Grid
      item
      container
      md={12}
      onClick={() => setIsExpanded((prev) => !prev)}
      data-testid={`collapse-item-${text}`}
    >
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
            color: color,
            p: 0,
            my: "8px",
            mx: "6px",
          }}
        >
          {text ? text : "[ NO TITLE ]"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CollapseItemTitle;

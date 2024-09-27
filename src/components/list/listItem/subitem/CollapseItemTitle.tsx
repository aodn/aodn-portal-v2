import React from "react";
import { Grid, Typography } from "@mui/material";

interface CollapseItemTitleProps {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
}

const CollapseItemTitle: React.FC<CollapseItemTitleProps> = ({
  setIsExpanded,
  text,
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
        <Typography variant="detailTitle">
          {text ? text : "[ NO TITLE ]"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CollapseItemTitle;

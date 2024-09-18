import { Grid, IconButton } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React from "react";

interface CollapseBtnProps {
  onClick: () => void;
  expanded: boolean;
}

const CollapseBtn: React.FC<CollapseBtnProps> = ({ onClick, expanded }) => {
  return (
    <Grid
      item
      md={1}
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <IconButton aria-label="expand or collapse" onClick={onClick}>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Grid>
  );
};

export default CollapseBtn;

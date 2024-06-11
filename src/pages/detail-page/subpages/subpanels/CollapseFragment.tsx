import { ButtonBase, Collapse, Grid, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface CollapseFragmentProps {
  title: string;
  children: ReactNode;
}

const CollapseFragment: React.FC<CollapseFragmentProps> = ({
  title,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Grid container sx={{ backgroundColor: "#D2E1EA" }}>
      <ButtonBase
        onClick={() => {
          console.log("isExpanded", isExpanded);
          setIsExpanded(!isExpanded);
        }}
        sx={{ width: "100%" }}
      >
        <Grid item container md={12}>
          <Grid item md={11}>
            <Typography>{title}</Typography>
          </Grid>
          <Grid item md={1}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </Grid>
        </Grid>
      </ButtonBase>

      <Grid item md={12}>
        <Collapse in={isExpanded}>{children}</Collapse>
      </Grid>
    </Grid>
  );
};

export default CollapseFragment;

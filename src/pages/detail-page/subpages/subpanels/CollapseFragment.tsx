import { ButtonBase, Collapse, Grid, Typography } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { alpha } from "@mui/material/styles";

interface CollapseFragmentProps {
  title: string;
  children: ReactNode;
  isOnTop?: boolean;
}

const CollapseFragment: React.FC<CollapseFragmentProps> = ({
  isOnTop = false,
  title,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOnTop);
  useEffect(() => {
    if (isOnTop) setIsExpanded(true);
  }, [isOnTop]);
  return (
    <Grid container sx={{ backgroundColor: alpha("#D2E1EA", 0.3) }}>
      <ButtonBase
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        sx={{ width: "100%" }}
      >
        <Grid item container md={12}>
          <Grid item md={1} />
          <Grid item md={10}>
            <Typography
              align="left"
              variant="h3"
              sx={{
                paddingTop: "0px",
                color: "#5b5B5B",
                lineHeight: "24px",
                fontWeight: "600",
                fontStyle: "normal",
                fontSize: "20px",
              }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item md={1}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </Grid>
        </Grid>
      </ButtonBase>

      <Grid item md={12}>
        <Collapse in={isExpanded}>
          <Grid container>
            <Grid item md={2} />
            <Grid item md={10}>
              {children}
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default CollapseFragment;

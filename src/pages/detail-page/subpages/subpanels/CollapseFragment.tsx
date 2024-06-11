import { ButtonBase, Collapse, Grid, Typography } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface CollapseFragmentProps {
  title: string;
  children: ReactNode;
  isAutoExpanded?: boolean;
}

const CollapseFragment: React.FC<CollapseFragmentProps> = ({
  isAutoExpanded = false,
  title,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(isAutoExpanded);
  useEffect(() => {
    setIsExpanded(isAutoExpanded);
  }, [isAutoExpanded]);
  return (
    <Grid container sx={{ backgroundColor: "#D2E1EA" }}>
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

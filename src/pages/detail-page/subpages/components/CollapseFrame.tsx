import React, { ReactNode, useState } from "react";
import {
  ButtonBase,
  Collapse,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

interface CollapseFrameProps {
  title: string;
  children: ReactNode;
  isContactFragment?: boolean;
  email?: string;
}

const CollapseFrame: React.FC<CollapseFrameProps> = ({
  title,
  children,
  isContactFragment = false,
  email,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const titleComponent = () => {
    return (
      <Typography
        align="left"
        variant="h3"
        sx={{
          paddingTop: "0px",
          color: "#5b5B5B",
          lineHeight: "24px",
          fontWeight: "600",
          fontStyle: "normal",
          fontSize: "15px",
        }}
      >
        {title}
      </Typography>
    );
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: "#F2F6F9",
        marginY: "10px",
        maxHeight: "700px",
        overflowY: "auto",
      }}
    >
      <Grid item md={11}>
        <ButtonBase
          onClick={() => {
            if (isContactFragment && isExpanded) {
              return null;
            }
            setIsExpanded(!isExpanded);
          }}
          sx={{ width: "100%" }}
        >
          <Grid item container md={12}>
            <Grid item md={1}>
              {isContactFragment && isExpanded && <MailOutlineIcon />}
            </Grid>
            <Grid item md={11}>
              {isExpanded && isContactFragment ? (
                <Link href={`mailto:${email}`}>{titleComponent()}</Link>
              ) : (
                titleComponent()
              )}
            </Grid>
          </Grid>
        </ButtonBase>
      </Grid>
      <Grid item md={1}>
        <IconButton
          aria-label="expand or collapse"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Grid>

      <Grid item md={12}>
        <Collapse in={isExpanded}>
          <Grid container>
            <Grid item md={12}>
              {children}
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default CollapseFrame;

import React from "react";
import { ButtonBase, Grid, Link, Tooltip, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

interface CollapseItemTitleProps {
  onClick: () => void;
  isContact?: boolean;
  expanded: boolean;
  email?: string | undefined;
  title: string;
}

const CollapseItemTitle: React.FC<CollapseItemTitleProps> = ({
  onClick,
  isContact = false,
  expanded,
  email,
  title,
}) => {
  const generateTitle = () => {
    return (
      <Typography variant="detailTitle">
        {title ? title : "[ NO TITLE ]"}
      </Typography>
    );
  };

  return (
    <Grid
      item
      md={11}
      sx={{
        alignSelf: "center",
      }}
    >
      <ButtonBase onClick={onClick} sx={{ width: "100%" }}>
        <Grid item container md={12}>
          <Grid item md={1}>
            <MailOutlineIcon />
          </Grid>

          <Grid
            item
            md={11}
            sx={{
              textAlign: "left",
              whiteSpace: "normal",
            }}
          >
            {expanded && isContact ? (
              <Tooltip
                title={email ? `mail to: ${email}` : "[NO EMAIL PROVIDED]"}
                placement="top"
              >
                <Link href={`mailto:${email}`}>{generateTitle()}</Link>
              </Tooltip>
            ) : (
              generateTitle()
            )}
          </Grid>
        </Grid>
      </ButtonBase>
    </Grid>
  );
};

export default CollapseItemTitle;

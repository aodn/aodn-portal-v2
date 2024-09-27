import React from "react";
import { Grid, Link, Tooltip, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

interface CollapseContactItemTItleProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  email?: string | undefined;
  text: string;
}

const CollapseContactItemTitle: React.FC<CollapseContactItemTItleProps> = ({
  setIsExpanded,
  isExpanded,
  email,
  text,
}) => {
  const generateTitle = () => {
    return (
      <Typography variant="detailTitle">
        {text ? text : "[ NO TITLE ]"}
      </Typography>
    );
  };

  return (
    <Grid
      item
      container
      md={12}
      onClick={() => setIsExpanded((prev) => !prev)}
      data-testid={`collapse-item-${text}`}
    >
      {isExpanded && (
        <Grid item md={1}>
          <MailOutlineIcon />
        </Grid>
      )}
      <Grid item md={10} sx={{ textAlign: "left", whiteSpace: "normal" }}>
        {isExpanded ? (
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
  );
};

export default CollapseContactItemTitle;

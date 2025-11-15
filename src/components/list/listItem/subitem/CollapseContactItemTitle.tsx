import React from "react";
import { Grid, Link, Tooltip, Typography, Box } from "@mui/material";
import rc8Theme from "../../../../styles/themeRC8";
import { MailOutlineIcon } from "../../../../assets/icons/details/mail";
import { openInNewTab } from "../../../../utils/LinkUtils";

interface CollapseContactItemTItleProps {
  isExpanded?: boolean;
  email?: string | undefined;
  text: string;
}

const CollapseContactItemTitle: React.FC<CollapseContactItemTItleProps> = ({
  isExpanded = false,
  email,
  text,
}) => {
  const generateTitle = (color: string) => {
    return (
      <Typography
        sx={{
          ...rc8Theme.typography.body1Medium,
          p: 0,
          mx: "6px",
          color: color,
        }}
        data-testid="metadata-contact-title"
      >
        {text ? text : "[ NO TITLE ]"}
      </Typography>
    );
  };

  return (
    <Grid item container md={12} data-testid={`collapse-item-${text}`}>
      <Grid
        item
        md={12}
        sx={{ textAlign: "left", whiteSpace: "normal", py: "10px" }}
      >
        {isExpanded ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <MailOutlineIcon />
            <Tooltip
              title={email ? `mail to: ${email}` : "[NO EMAIL PROVIDED]"}
              placement="top"
            >
              <Link
                href={`mailto:${email}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openInNewTab(`mailto:${email}`);
                }}
              >
                {generateTitle(rc8Theme.palette.primary1)}
              </Link>
            </Tooltip>
          </Box>
        ) : (
          generateTitle(rc8Theme.palette.text1)
        )}
      </Grid>
    </Grid>
  );
};

export default CollapseContactItemTitle;

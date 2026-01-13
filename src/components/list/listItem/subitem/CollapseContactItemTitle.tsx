import React from "react";
import { Grid, Link, Tooltip, Typography, Box } from "@mui/material";
import rc8Theme from "../../../../styles/themeRC8";
import { MailOutlineIcon } from "../../../../assets/icons/details/mail";
import { openInNewTab } from "../../../../utils/LinkUtils";

interface CollapseContactItemTItleProps {
  isExpanded?: boolean;
  email?: string | undefined;
  text: string;
  roles?: string[];
}

const CollapseContactItemTitle: React.FC<CollapseContactItemTItleProps> = ({
  isExpanded = false,
  email,
  text,
  roles,
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
        sx={{
          textAlign: "left",
          whiteSpace: "normal",
          py: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
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

        {roles && roles.length > 0 && (
          <Typography
            sx={{
              ...rc8Theme.typography.body1Medium,
              backgroundColor: rc8Theme.palette.primary4,
              padding: "4px 10px",
              borderRadius: "6px",
              ml: 2,
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            {/* Convert camelCase to readable text "pointOfContact" → "Point Of Contact" */}
            {roles[0].replace(/([A-Z])/g, " $1").trim()}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default CollapseContactItemTitle;

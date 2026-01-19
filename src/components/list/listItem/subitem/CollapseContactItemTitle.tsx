import React from "react";
import { Grid, Link, Tooltip, Typography, Box } from "@mui/material";
import { portalTheme } from "../../../../styles";
import { MailOutlineIcon } from "../../../../assets/icons/details/mail";
import { openInNewTab } from "../../../../utils/LinkUtils";
import { addSpacesToCamelCase } from "../../../../utils/FormatUtils";
import LabelChip from "../../../common/label/LabelChip";

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
          ...portalTheme.typography.body1Medium,
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
                {generateTitle(portalTheme.palette.primary1)}
              </Link>
            </Tooltip>
          </Box>
        ) : (
          generateTitle(portalTheme.palette.text1)
        )}

        {roles && roles.length > 0 && (
          <LabelChip text={[addSpacesToCamelCase(roles[0])]} />
        )}
      </Grid>
    </Grid>
  );
};

export default CollapseContactItemTitle;

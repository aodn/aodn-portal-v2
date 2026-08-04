import React from "react";
import { Grid, Link, Tooltip, Typography, Box } from "@mui/material";
import { portalTheme } from "../../../../styles";
import { MailOutlineIcon } from "@/assets/icons/details/mail";
import { openInNewTab } from "@/utils/LinkUtils";
import { addSpacesToCamelCase } from "@/utils/FormatUtils";
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
          display: "flex",
          alignItems: "center",
          minHeight: "100%",
          p: 0,
          ...portalTheme.typography.title1Medium,
          color: color,
        }}
        data-testid="metadata-contact-title"
      >
        {text ? text : "[ NO TITLE ]"}
      </Typography>
    );
  };

  return (
    <Grid container data-testid={`collapse-item-${text}`} size={12}>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          gap: 1,
        }}
        size={12}
      >
        {isExpanded ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              gap: 1,
            }}
          >
            <Box>
              <MailOutlineIcon />
            </Box>
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

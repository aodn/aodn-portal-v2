import React from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import dayjs from "dayjs";
import { portalTheme } from "../../../../styles";
import { gap } from "@/styles/constants";
import { pageDefault } from "../../../common/constants";
import { openInNewTab } from "@/utils/LinkUtils";

export const MAP_FOOTER_HEIGHT = "22px";

const recipient = "info@aodn.org.au";
const subject = "AODN Data Discovery enquiry";
const currentYear = dayjs(new Date()).year();

const handleClickContactUs = () => {
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
};

const linkSx = {
  ...portalTheme.typography.body3Small,
  color: portalTheme.palette.text1,
  lineHeight: MAP_FOOTER_HEIGHT,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: gap.md,
  textDecoration: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const MapFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      data-testid="map-footer"
      sx={{
        flexShrink: 0,
        width: "100%",
        height: MAP_FOOTER_HEIGHT,
        opacity: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        px: gap.lg,
        bgcolor: portalTheme.palette.neutral2,
        border: `1.5px solid ${portalTheme.palette.primary1}`,
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          ...portalTheme.typography.body3Small,
          color: portalTheme.palette.text1,
          lineHeight: MAP_FOOTER_HEIGHT,
          padding: 0,
          whiteSpace: "nowrap",
        }}
      >
        Copyright © {currentYear}. All rights reserved.
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          component="button"
          type="button"
          onClick={handleClickContactUs}
          sx={linkSx}
        >
          <MailOutlineIcon
            sx={{ fontSize: portalTheme.typography.body3Small.fontSize }}
          />
          Contact Us
        </Link>
        <Link
          component="button"
          type="button"
          onClick={() => openInNewTab(`${pageDefault.url.IMOS}/terms-of-use`)}
          sx={linkSx}
        >
          Terms of Use
        </Link>
        <Link
          component="button"
          type="button"
          onClick={() =>
            openInNewTab(`${pageDefault.url.IMOS}/conditions-of-use`)
          }
          sx={linkSx}
        >
          Conditions of Use
        </Link>
        <Link
          component="button"
          type="button"
          onClick={() =>
            openInNewTab(`${pageDefault.url.IMOS}/resources/acknowledging-us`)
          }
          sx={linkSx}
        >
          Acknowledging Us
        </Link>
      </Stack>
    </Box>
  );
};

export default MapFooter;

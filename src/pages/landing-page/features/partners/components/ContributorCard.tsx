import { FC } from "react";
import { Box, Link, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { portalTheme } from "@/styles";
import {
  Contributor,
  LOGO_SIZE_POWER,
  PARTNERS_COLOURS,
  PARTNERS_MEDIA,
} from "../constants";

interface ContributorCardProps {
  contributor: Contributor;
  onViewDatasets: () => void;
}

const HOVER_PANEL_CLASS = "contributor-hover-panel";
const { palette } = portalTheme;
const WHITE = palette.text3;
const SHADOW_COLOUR = PARTNERS_COLOURS.imosCard1;

// Clamp text to a number of lines
const lineClamp = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const ContributorCard: FC<ContributorCardProps> = ({
  contributor,
  onViewDatasets,
}) => {
  const {
    datasetGroup,
    shortName,
    fullName,
    website,
    description,
    logo,
    logoAspectRatio,
    logoScale,
    accent,
    brand,
  } = contributor;
  // Logos look the same size when they cover a similar area
  const logoWidth = Math.pow(logoAspectRatio, LOGO_SIZE_POWER) * logoScale;
  const logoHeight = Math.pow(logoAspectRatio, LOGO_SIZE_POWER - 1) * logoScale;

  return (
    <Box
      role="listitem"
      tabIndex={0}
      data-testid={`contributor-card-${datasetGroup}`}
      sx={{
        // Logo size is relative to the card width (cqi)
        "--logo-base": "min(39cqi, 124px)",
        containerType: "inline-size",
        position: "relative",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
        // The hover panel sets the content height. With clip (not hidden),
        // the card grows past the ratio when the hover text needs more room.
        overflow: "clip",
        aspectRatio: "340 / 278",
        // Fill the column. Without it, grid sets the width from the ratio
        // when a card grows taller.
        width: "100%",
        minWidth: 0,
        // Same height for all cards in a row
        alignSelf: "stretch",
        bgcolor: palette.neutral2,
        border: `1px solid ${PARTNERS_COLOURS.cardBorder}`,
        borderTop: `5px solid ${accent}`,
        borderRadius: portalTheme.borderRadius.lg,
        boxShadow: `0 1px 3px ${alpha(SHADOW_COLOUR, 0.06)}`,
        outlineOffset: "3px",
        transition: "transform .18s, box-shadow .18s",
        "&:hover, &:focus-within": {
          transform: "translateY(-3px)",
          boxShadow: `0 14px 32px ${alpha(SHADOW_COLOUR, 0.18)}`,
        },
        [`&:hover .${HOVER_PANEL_CLASS}, &:focus-within .${HOVER_PANEL_CLASS}`]:
          {
            opacity: 1,
            visibility: "visible",
            transform: "none",
            transitionDelay: "0s",
          },
        // Touch screens have no hover, so a tap focuses the card instead
        "@media (hover: none)": { cursor: "pointer" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        [PARTNERS_MEDIA.largePhone]: {
          "--logo-base": "64px",
          aspectRatio: "auto",
          // Face height: logo 84 + name 66 + padding 28 + border 6
          minHeight: "184px",
        },
      }}
    >
      {/* Card face, under the hover panel */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: "20px 20px 22px",
          [PARTNERS_MEDIA.largePhone]: { p: "14px 12px" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            [PARTNERS_MEDIA.largePhone]: { flex: "none", height: "84px" },
          }}
        >
          <Box
            component="img"
            src={logo}
            alt={`${fullName} logo`}
            loading="lazy"
            decoding="async"
            sx={{
              width: `calc(var(--logo-base) * ${logoWidth.toFixed(3)})`,
              height: `calc(var(--logo-base) * ${logoHeight.toFixed(3)})`,
              maxWidth: "92%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Fixed height, so one and two line names line up */}
        <Box
          sx={{
            flex: "none",
            width: "100%",
            minHeight: "78px",
            mt: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            [PARTNERS_MEDIA.largePhone]: { minHeight: "60px", mt: "6px" },
          }}
        >
          <Typography
            component="h3"
            variant="heading2"
            sx={{
              fontSize: "22px",
              lineHeight: 1.2,
              color: PARTNERS_COLOURS.heading,
              [PARTNERS_MEDIA.largePhone]: { fontSize: "17px" },
            }}
          >
            {shortName}
          </Typography>
          <Typography
            component="p"
            variant="body2Regular"
            sx={{
              ...lineClamp(2),
              mt: "6px",
              lineHeight: 1.55,
              color: PARTNERS_COLOURS.cardText,
              [PARTNERS_MEDIA.largePhone]: {
                fontSize: "12.5px",
                lineHeight: 1.45,
                mt: "3px",
              },
            }}
          >
            {fullName}
          </Typography>
        </Box>
      </Box>

      <Box
        className={HOVER_PANEL_CLASS}
        data-testid={`contributor-hover-panel-${datasetGroup}`}
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "left",
          p: "22px 24px",
          color: WHITE,
          bgcolor: brand,
          opacity: 0,
          visibility: "hidden",
          transform: "translateY(6px)",
          transition:
            "opacity .2s ease, transform .2s ease, visibility 0s linear .2s",
          // Never squeeze a clamped line in half
          "& > *": { flexShrink: 0 },
          [PARTNERS_MEDIA.largePhone]: { p: "12px 13px" },
        }}
      >
        <Typography
          component="p"
          variant="body3Small"
          sx={{
            ...lineClamp(2),
            mb: "6px",
            fontSize: "12px",
            lineHeight: 1.35,
            letterSpacing: "0.2px",
            color: alpha(WHITE, 0.75),
            [PARTNERS_MEDIA.largePhone]: {
              WebkitLineClamp: 1,
              mb: "4px",
              fontSize: "10.5px",
            },
          }}
        >
          {fullName}
        </Typography>
        <Typography
          component="h4"
          variant="heading2"
          sx={{
            fontSize: "22px",
            lineHeight: 1.2,
            letterSpacing: "-0.2px",
            color: WHITE,
            [PARTNERS_MEDIA.largePhone]: { fontSize: "16px" },
          }}
        >
          {shortName}
        </Typography>
        <Typography
          component="p"
          variant="body2Regular"
          sx={{
            ...lineClamp(4),
            mt: "9px",
            lineHeight: 1.5,
            color: alpha(WHITE, 0.92),
            [PARTNERS_MEDIA.largePhone]: {
              WebkitLineClamp: 3,
              mt: "6px",
              fontSize: "11.5px",
              lineHeight: 1.4,
            },
          }}
        >
          {description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            mt: "16px",
            "& a:focus-visible, & button:focus-visible": {
              outline: `2px solid ${WHITE}`,
              outlineOffset: "3px",
              borderRadius: "3px",
            },
            [PARTNERS_MEDIA.largePhone]: { gap: "4px 12px", mt: "9px" },
          }}
        >
          <Link
            component="button"
            underline="none"
            data-testid={`contributor-view-datasets-${datasetGroup}`}
            onClick={onViewDatasets}
            aria-label={`View ${shortName} datasets in the AODN catalogue`}
            sx={{
              ...portalTheme.typography.body1Medium,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: WHITE,
              pb: "5px",
              borderBottom: `2px solid ${alpha(WHITE, 0.85)}`,
              // The theme underlines links on hover, keep only the border
              "&:hover": { borderBottomColor: WHITE, textDecoration: "none" },
              "& svg": { fontSize: "15px" },
              [PARTNERS_MEDIA.largePhone]: { fontSize: "11.5px" },
            }}
          >
            View datasets
            <ArrowForwardIcon />
          </Link>
          <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            data-testid={`contributor-website-${datasetGroup}`}
            aria-label={`Visit the ${fullName} website (opens in a new tab)`}
            sx={{
              ...portalTheme.typography.body2Regular,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              pb: "6px",
              fontSize: "13.5px",
              color: alpha(WHITE, 0.88),
              borderBottom: "1px solid transparent",
              "&:hover": {
                color: WHITE,
                borderBottomColor: alpha(WHITE, 0.7),
                textDecoration: "none",
              },
              "& svg": { fontSize: "13px" },
              [PARTNERS_MEDIA.largePhone]: { fontSize: "11px", pb: "4px" },
            }}
          >
            Website
            <OpenInNewIcon />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ContributorCard;

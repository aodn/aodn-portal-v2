import { FC } from "react";
import { Box, Link, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { portalTheme } from "@/styles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { Contributor, LOGO_SIZE_POWER, PARTNERS_COLOURS } from "../constants";

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
  // Smaller card with smaller text on phones
  const { isMobile } = useBreakpoint();
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
        "--logo-base": isMobile ? "64px" : "min(39cqi, 124px)",
        containerType: "inline-size",
        position: "relative",
        isolation: "isolate",
        // One cell. The hover panel is always in it, and on phones the face too.
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        // With clip (not hidden), the card grows past the ratio
        // when the hover text needs more room
        overflow: "clip",
        aspectRatio: isMobile ? "auto" : "340 / 278",
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
      }}
    >
      {/* Card face, under the hover panel. On wider screens it fills the
          card, so the ratio (not the logo) sets the card height. */}
      <Box
        sx={{
          gridArea: "1 / 1",
          ...(isMobile ? {} : { position: "absolute", inset: 0 }),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: isMobile ? "14px 12px" : "20px 20px 22px",
        }}
      >
        <Box
          sx={{
            flex: isMobile ? "none" : 1,
            height: isMobile ? "84px" : undefined,
            minHeight: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
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
            minHeight: isMobile ? "60px" : "78px",
            mt: isMobile ? "6px" : "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            component="h3"
            variant={isMobile ? "heading4" : "heading3"}
            sx={{ color: PARTNERS_COLOURS.heading }}
          >
            {shortName}
          </Typography>
          <Typography
            component="p"
            variant={isMobile ? "body3Small" : "body2Regular"}
            sx={{
              ...lineClamp(2),
              mt: isMobile ? "3px" : "6px",
              color: PARTNERS_COLOURS.cardText,
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
          gridArea: "1 / 1",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "left",
          p: isMobile ? "12px 13px" : "22px 24px",
          color: WHITE,
          bgcolor: brand,
          opacity: 0,
          visibility: "hidden",
          transform: "translateY(6px)",
          transition:
            "opacity .2s ease, transform .2s ease, visibility 0s linear .2s",
          // Never squeeze a clamped line in half
          "& > *": { flexShrink: 0 },
        }}
      >
        <Typography
          component="p"
          variant="body3Small"
          sx={{
            ...lineClamp(isMobile ? 1 : 2),
            mb: isMobile ? "4px" : "6px",
            color: alpha(WHITE, 0.75),
          }}
        >
          {fullName}
        </Typography>
        <Typography
          component="h4"
          variant={isMobile ? "heading4" : "heading3"}
          sx={{ color: WHITE }}
        >
          {shortName}
        </Typography>
        <Typography
          component="p"
          variant={isMobile ? "body3Small" : "body2Regular"}
          sx={{
            ...lineClamp(isMobile ? 3 : 4),
            mt: isMobile ? "6px" : "9px",
            color: alpha(WHITE, 0.92),
          }}
        >
          {description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isMobile ? "4px 12px" : "14px",
            mt: isMobile ? "9px" : "16px",
            "& a:focus-visible, & button:focus-visible": {
              outline: `2px solid ${WHITE}`,
              outlineOffset: "3px",
              borderRadius: "3px",
            },
          }}
        >
          <Link
            component="button"
            underline="none"
            data-testid={`contributor-view-datasets-${datasetGroup}`}
            onClick={onViewDatasets}
            aria-label={`View ${shortName} datasets in the AODN catalogue`}
            sx={{
              // The theme Link styles set their own font, so set the token here
              ...portalTheme.typography[
                isMobile ? "body3Small" : "body1Medium"
              ],
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              color: WHITE,
              pb: "5px",
              borderBottom: `2px solid ${alpha(WHITE, 0.85)}`,
              // The theme underlines links on hover, keep only the border
              "&:hover": { borderBottomColor: WHITE, textDecoration: "none" },
              "& svg": { fontSize: "15px" },
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
              ...portalTheme.typography.body3Small,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              pb: isMobile ? "4px" : "6px",
              color: alpha(WHITE, 0.88),
              borderBottom: "1px solid transparent",
              "&:hover": {
                color: WHITE,
                borderBottomColor: alpha(WHITE, 0.7),
                textDecoration: "none",
              },
              "& svg": { fontSize: "13px" },
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

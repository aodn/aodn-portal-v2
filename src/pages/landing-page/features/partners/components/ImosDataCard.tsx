import { FC, FocusEvent, useId, useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { portalTheme } from "@/styles";
import useBreakpoint from "@/hooks/useBreakpoint";
import IMOSLogoWhite from "@/assets/partners/imos-logo-white.webp";
import { IMOS_STATS, PARTNERS_COLOURS } from "../constants";
import ImosWaves from "./ImosWaves";

interface ImosDataCardProps {
  onExplore: () => void;
}

const {
  imosCard1,
  imosCard2,
  imosCard3,
  imosCard4,
  imosStats,
  imosGlow,
  buttonText,
  buttonHover,
} = PARTNERS_COLOURS;
const { palette } = portalTheme;
const WHITE = palette.text3;
const STAT_BORDER = `1px solid ${alpha(WHITE, 0.1)}`;

// Dark layers behind the text, so it stays readable when the card is
// narrow enough for the light band to reach the text
const SCRIM = {
  laptop: `linear-gradient(90deg, ${alpha(imosCard1, 0.88)} 0px, ${alpha(imosCard1, 0.8)} 900px, ${alpha(imosCard1, 0)} 1120px)`,
  tablet: `linear-gradient(90deg, ${alpha(imosCard1, 0.9)} 0px, ${alpha(imosCard1, 0.84)} 700px, ${alpha(imosCard1, 0)} 960px)`,
  mobile: `linear-gradient(180deg, ${alpha(imosCard1, 0.55)} 0%, ${alpha(imosCard1, 0.86)} 22%, ${alpha(imosCard1, 0.88)} 100%)`,
};

// Light band that slowly moves while the card is live
const glowMotion = keyframes`
  from { transform: rotate(-34deg) scaleX(0.5) translate(0, 0); }
  to { transform: rotate(-29deg) scaleX(0.56) translate(-3%, 4%); }
`;

const ImosDataCard: FC<ImosDataCardProps> = ({ onExplore }) => {
  const titleId = useId();
  const { isLaptop, isTablet, isUnderLaptop, isMobile, isLargeMobile } =
    useBreakpoint();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [isActive, setIsActive] = useState(false);
  const isLive = isActive && !reduceMotion;

  const scrim = isMobile
    ? SCRIM.mobile
    : isTablet
      ? SCRIM.tablet
      : isLaptop
        ? SCRIM.laptop
        : "none";
  const statColumns = isMobile ? 2 : 4;
  const statPadding = isLargeMobile
    ? "18px 14px 20px 20px"
    : isMobile
      ? "20px 20px 22px 32px"
      : "26px 24px 28px";

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsActive(false);
    }
  };

  return (
    <Box
      role="region"
      aria-labelledby={titleId}
      data-testid="imos-data-card"
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={handleBlur}
      sx={{
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        color: WHITE,
        borderRadius: isLargeMobile
          ? portalTheme.borderRadius.lg
          : portalTheme.borderRadius.xlg,
        background: `linear-gradient(100deg, ${imosCard1} 0%, ${imosCard2} 40%, ${imosCard3} 68%, ${imosCard4} 100%)`,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background: scrim,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          zIndex: -2,
          left: "42%",
          top: "-58%",
          width: "80%",
          height: "190%",
          pointerEvents: "none",
          background: `radial-gradient(closest-side, ${alpha(imosGlow, 0.92)} 0%, ${alpha(imosGlow, 0.55)} 45%, ${alpha(imosGlow, 0)} 100%)`,
          transform: "rotate(-34deg) scaleX(0.5)",
          animation: reduceMotion
            ? "none"
            : `${glowMotion} 7s ease-in-out infinite alternate`,
          animationPlayState: isLive ? "running" : "paused",
          "&::after": {
            content: '""',
            position: "absolute",
            left: "30%",
            top: "20%",
            width: "60%",
            height: "30%",
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${alpha(imosGlow, 0.7)}, ${alpha(imosGlow, 0)})`,
          },
        }}
      />
      <ImosWaves isLive={isLive} />

      <Box
        sx={{
          maxWidth: "1080px",
          p: isLargeMobile
            ? "28px 20px 0"
            : isMobile
              ? "36px 32px 0"
              : "48px 56px 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isLargeMobile ? "14px" : "18px",
          }}
        >
          <Box
            component="img"
            src={IMOSLogoWhite}
            alt="IMOS — Integrated Marine Observing System"
            loading="lazy"
            decoding="async"
            sx={{
              display: "block",
              width: "auto",
              height: isLargeMobile ? "38px" : "44px",
            }}
          />
          <Box
            aria-hidden
            sx={{ width: "1px", height: "36px", bgcolor: alpha(WHITE, 0.3) }}
          />
          <Typography
            component="p"
            variant={isLargeMobile ? "heading4" : "heading3"}
            sx={{ fontWeight: 400, color: palette.primary4 }}
          >
            Access to IMOS Data
          </Typography>
        </Box>

        <Typography
          id={titleId}
          component="h2"
          variant={isMobile ? "heading2" : "heading1"}
          sx={{
            mt: isLargeMobile ? "18px" : "22px",
            lineHeight: 1.2,
            color: WHITE,
          }}
        >
          Two decades of Australian ocean observations{" "}
          <Box
            component="span"
            sx={{ display: isUnderLaptop ? "none" : "block" }}
          />
          &ndash; free and open to everyone
        </Typography>

        <Typography
          component="p"
          variant="title2Regular"
          sx={{
            mt: isMobile ? "24px" : "38px",
            maxWidth: "940px",
            color: palette.primary6,
          }}
        >
          The Australian Ocean Data Network (AODN) is responsible for the
          management, discovery, access and delivery of IMOS data, working with
          IMOS Facilities and data providers to ensure these data are
          quality-assured, well described, discoverable and accessible through
          the AODN Portal and associated services. The AODN is funded and
          operated by the Integrated Marine Observing System (IMOS).
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: isLargeMobile ? "column" : "row",
            alignItems: isLargeMobile ? "stretch" : "flex-start",
            gap: isLargeMobile ? "12px" : "16px",
            mt: isMobile ? "32px" : "48px",
          }}
        >
          <Button
            data-testid="explore-imos-datasets"
            onClick={onExplore}
            endIcon={<ArrowForwardIcon />}
            sx={{
              ...portalTheme.typography.title2Regular,
              height: "48px",
              px: "24px",
              color: buttonText,
              bgcolor: WHITE,
              borderRadius: portalTheme.borderRadius.sm,
              textTransform: "none",
              "&:hover": { bgcolor: buttonHover },
            }}
          >
            Explore IMOS datasets
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${statColumns}, 1fr)`,
          mt: isMobile ? "36px" : "48px",
          bgcolor: alpha(imosStats, 0.8),
          borderTop: STAT_BORDER,
        }}
      >
        {IMOS_STATS.map((stat, index) => (
          <Box
            key={stat.value}
            sx={{
              p: statPadding,
              pl: !isMobile && index === 0 ? "56px" : undefined,
              // Lines between stats, not around the outside
              borderLeft: index % statColumns ? STAT_BORDER : undefined,
              borderTop: index >= statColumns ? STAT_BORDER : undefined,
            }}
          >
            <Typography
              component="p"
              variant={isLargeMobile ? "heading3" : "heading2"}
              sx={{ color: WHITE }}
            >
              {stat.value}
            </Typography>
            <Typography
              component="p"
              variant={isLargeMobile ? "body3Small" : "body2Regular"}
              sx={{ mt: "6px", color: palette.primary4 }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImosDataCard;

import { FC, FocusEvent, useId, useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { portalTheme } from "@/styles";
import IMOSLogoWhite from "@/assets/partners/imos-logo-white.webp";
import { IMOS_STATS, PARTNERS_COLOURS, PARTNERS_MEDIA } from "../constants";
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

// Light band that slowly moves while the card is live
const glowMotion = keyframes`
  from { transform: rotate(-34deg) scaleX(0.5) translate(0, 0); }
  to { transform: rotate(-29deg) scaleX(0.56) translate(-3%, 4%); }
`;

const ImosDataCard: FC<ImosDataCardProps> = ({ onExplore }) => {
  const titleId = useId();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [isActive, setIsActive] = useState(false);
  const isLive = isActive && !reduceMotion;

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
        borderRadius: portalTheme.borderRadius.xlg,
        background: `linear-gradient(100deg, ${imosCard1} 0%, ${imosCard2} 40%, ${imosCard3} 68%, ${imosCard4} 100%)`,
        // Dark layer behind the text once the card is narrow enough
        // for the light band to reach the text
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          [PARTNERS_MEDIA.smallDesktop]: {
            background: `linear-gradient(90deg, ${alpha(imosCard1, 0.88)} 0px, ${alpha(imosCard1, 0.8)} 900px, ${alpha(imosCard1, 0)} 1120px)`,
          },
          [PARTNERS_MEDIA.laptop]: {
            background: `linear-gradient(90deg, ${alpha(imosCard1, 0.9)} 0px, ${alpha(imosCard1, 0.84)} 700px, ${alpha(imosCard1, 0)} 960px)`,
          },
          [PARTNERS_MEDIA.narrowTablet]: {
            background: `linear-gradient(180deg, ${alpha(imosCard1, 0.55)} 0%, ${alpha(imosCard1, 0.86)} 22%, ${alpha(imosCard1, 0.88)} 100%)`,
          },
        },
        [PARTNERS_MEDIA.phone]: {
          borderRadius: portalTheme.borderRadius.lg,
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
          animation: `${glowMotion} 7s ease-in-out infinite alternate`,
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
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      />
      <ImosWaves isLive={isLive} />

      <Box
        sx={{
          maxWidth: "1080px",
          p: "48px 56px 0",
          [PARTNERS_MEDIA.narrowTablet]: { p: "36px 32px 0" },
          [PARTNERS_MEDIA.phone]: { p: "28px 20px 0" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            [PARTNERS_MEDIA.phone]: { gap: "14px" },
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
              height: "44px",
              [PARTNERS_MEDIA.phone]: { height: "38px" },
            }}
          />
          <Box
            aria-hidden
            sx={{ width: "1px", height: "36px", bgcolor: alpha(WHITE, 0.3) }}
          />
          <Typography
            component="p"
            variant="heading3"
            sx={{
              fontWeight: 400,
              lineHeight: 1.3,
              color: palette.primary4,
              [PARTNERS_MEDIA.phone]: { fontSize: "17px" },
            }}
          >
            Access to IMOS Data
          </Typography>
        </Box>

        <Typography
          id={titleId}
          component="h2"
          variant="heading1"
          sx={{
            mt: "22px",
            lineHeight: 1.2,
            letterSpacing: "-0.3px",
            color: WHITE,
            [PARTNERS_MEDIA.laptop]: { fontSize: "34px" },
            [PARTNERS_MEDIA.narrowTablet]: { fontSize: "32px" },
            [PARTNERS_MEDIA.phone]: { fontSize: "26px", mt: "18px" },
          }}
        >
          Two decades of Australian ocean observations{" "}
          <Box
            component="span"
            sx={{
              display: "block",
              [PARTNERS_MEDIA.laptop]: { display: "none" },
            }}
          />
          &ndash; free and open to everyone
        </Typography>

        <Typography
          component="p"
          variant="title2Regular"
          sx={{
            mt: "38px",
            maxWidth: "940px",
            color: palette.primary6,
            [PARTNERS_MEDIA.narrowTablet]: { mt: "24px" },
            [PARTNERS_MEDIA.phone]: { fontSize: "15px" },
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
            gap: "16px",
            mt: "48px",
            [PARTNERS_MEDIA.narrowTablet]: { mt: "32px" },
            [PARTNERS_MEDIA.phone]: {
              flexDirection: "column",
              alignItems: "stretch",
              gap: "12px",
            },
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
          gridTemplateColumns: "repeat(4, 1fr)",
          mt: "48px",
          bgcolor: alpha(imosStats, 0.8),
          borderTop: STAT_BORDER,
          "& > div": { p: "26px 24px 28px" },
          "& > div:first-of-type": { pl: "56px" },
          "& > div + div": { borderLeft: STAT_BORDER },
          [PARTNERS_MEDIA.narrowTablet]: {
            gridTemplateColumns: "repeat(2, 1fr)",
            mt: "36px",
            "& > div, & > div:first-of-type": { p: "20px 20px 22px 32px" },
            "& > div:nth-of-type(odd)": { borderLeft: 0 },
            "& > div:nth-of-type(n+3)": { borderTop: STAT_BORDER },
          },
          [PARTNERS_MEDIA.phone]: {
            "& > div, & > div:first-of-type": { p: "18px 14px 20px 20px" },
          },
        }}
      >
        {IMOS_STATS.map((stat) => (
          <Box key={stat.value}>
            <Typography
              component="p"
              variant="heading2"
              sx={{
                fontSize: "27px",
                lineHeight: 1.15,
                color: WHITE,
                [PARTNERS_MEDIA.phone]: { fontSize: "22px" },
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              component="p"
              variant="body2Regular"
              sx={{
                mt: "6px",
                lineHeight: 1.4,
                color: palette.primary4,
                [PARTNERS_MEDIA.phone]: { fontSize: "13px" },
              }}
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

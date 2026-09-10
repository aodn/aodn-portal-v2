import InfoIcon from "@mui/icons-material/Info";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import feedbackIcon from "@/assets/icons/feedback-button.png";
import { portalTheme } from "@/styles";

const FEEDBACK_URL =
  "https://forms.office.com/pages/responsepage.aspx?id=VV3rFZEZvEaNp6slI03uCIbxNcrqZltDmWw3jsls7JBUMEJTRENHV1o4QzcyWUtKUzJZU1U2SDk1US4u&route=shorturl";

interface FeedbackButtonProps {
  mobile?: boolean;
}

const FeedbackButton: FC<FeedbackButtonProps> = ({ mobile = false }) => {
  const button = (
    <Button
      component="a"
      href={FEEDBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Feedback for Portal (opens survey in a new tab)"
      data-testid="feedback-button"
      startIcon={
        <Box
          component="img"
          src={feedbackIcon}
          alt=""
          aria-hidden="true"
          sx={{
            width: mobile ? "26.55px" : "34px",
            height: mobile ? "25.6px" : "32px",
          }}
        />
      }
      sx={{
        width: mobile ? "100%" : "250px",
        minHeight: mobile ? "38px" : "48px",
        height: mobile ? "38px" : undefined,
        maxHeight: mobile ? "38px" : undefined,
        px: mobile ? undefined : 3,
        py: mobile ? 0 : 1,
        borderRadius: portalTheme.borderRadius.lg,
        ...(mobile
          ? {
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
            }
          : portalTheme.typography.heading4),
        backgroundColor: portalTheme.designTokens.colours.product.feedback,
        color: portalTheme.palette.text3,
        textTransform: "none",
        "& .MuiButton-startIcon": {
          ml: 0,
          mr: 1,
        },
        "&:hover": { backgroundColor: portalTheme.palette.primary1 },
      }}
    >
      Feedback for Portal
    </Button>
  );

  if (mobile) return button;

  return (
    <Tooltip
      placement="bottom-end"
      enterDelay={100}
      title={
        <Box sx={{ display: "flex", gap: 1.25 }}>
          <InfoIcon
            sx={{
              color: portalTheme.palette.secondary1,
              flexShrink: 0,
              fontSize: 18,
              mt: "2px",
            }}
          />
          <Typography variant="body2Regular">
            This portal is currently in beta stage, your feedback is much
            appreciated.
          </Typography>
        </Box>
      }
      slotProps={{
        tooltip: {
          sx: {
            width: "249px",
            maxWidth: "249px",
            boxSizing: "border-box",
            p: 1.25,
            color: portalTheme.palette.text1,
            backgroundColor: portalTheme.palette.neutral2,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
            borderRadius: "8px",
          },
        },
      }}
    >
      {button}
    </Tooltip>
  );
};

export default FeedbackButton;

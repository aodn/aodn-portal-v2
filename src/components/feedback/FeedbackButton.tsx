import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import FeedbackIcon from "@/assets/icons/feedback";

const FEEDBACK_URL =
  "https://forms.office.com/pages/responsepage.aspx?id=VV3rFZEZvEaNp6slI03uCIbxNcrqZltDmWw3jsls7JBUMEJTRENHV1o4QzcyWUtKUzJZU1U2SDk1US4u&route=shorturl";

type FeedbackButtonProps = {
  mobile?: boolean;
};

const FeedbackButton = ({ mobile = false }: FeedbackButtonProps) => {
  const button = (
    <Button
      component="a"
      href={FEEDBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Feedback for Portal (opens survey in a new tab)"
      startIcon={
        <FeedbackIcon
          width={mobile ? 26.55 : 34}
          height={mobile ? 25.6 : 32}
          aria-hidden="true"
        />
      }
      sx={{
        width: mobile ? "100%" : "266px",
        minHeight: mobile ? "38px" : "52px",
        height: mobile ? "38px" : undefined,
        maxHeight: mobile ? "38px" : undefined,
        py: mobile ? 0 : undefined,
        borderRadius: "10px",
        backgroundColor: "#5796CD",
        color: "common.white",
        fontSize: mobile ? "14px" : "16px",
        fontWeight: 500,
        lineHeight: mobile ? "20px" : "22px",
        textTransform: "none",
        "& .MuiButton-startIcon": {
          mr: mobile ? 1 : 1,
          "& > svg": { width: mobile ? "26.55px" : "34px" },
        },
        "&:hover": { backgroundColor: "#3B6E8F" },
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
        <Box sx={{ display: "flex", gap: 1, p: 0.5 }}>
          <InfoOutlinedIcon
            sx={{ color: "#5796CD", fontSize: 18, mt: "2px" }}
          />
          <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>
            This portal is currently in beta stage, your feedback is much
            appreciated.
          </Typography>
        </Box>
      }
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: "266px",
            p: 1.25,
            color: "#3C3C3C",
            backgroundColor: "common.white",
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

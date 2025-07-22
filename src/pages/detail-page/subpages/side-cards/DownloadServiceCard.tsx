import { Typography, Box, Button } from "@mui/material";
import { DownloadNotAvailableIcon } from "../../../../assets/icons/download/download_not_available";

const DownloadServiceCard = () => {
  return (
    <Box
      sx={{
        minHeight: "222px",
        flexShrink: 0,
        borderRadius: "5px",
        background: "#FFF",
      }}
      component="section"
      role="region"
      aria-labelledby="download-heading"
    >
      <Box
        sx={{
          height: "40px",
          borderRadius: "6px 6px 0px 0px",
          background: "#FFF",
          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          id="download-heading"
          sx={{ color: "#3C3C3C", fontWeight: 500 }}
        >
          Download Service
        </Typography>
      </Box>

      <Box
        sx={{
          borderRadius: "6px",
          border: "1px solid #8C8C8C",
          background: "#FFF",
          padding: "16px",
          margin: "16px",
        }}
        role="status"
        aria-live="polite"
      >
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ lineHeight: "22px", fontSize: "14px", color: "#3C3C3C" }}
        >
          Data download via this method is not currently available. Please see
          other data access options below.
        </Typography>
      </Box>

      <Button
        disabled
        variant="contained"
        disableElevation
        sx={{
          gap: 1,
          borderRadius: "6px",
          background: "#8C8C8C",
          width: "90%",
          height: "38px",
          margin: "0 16px 16px 16px",
          fontSize: "16px",
          fontWeight: 400,
          "&:disabled": {
            background: "#8C8C8C",
            color: "white",
            cursor: "not-allowed",
          },
          "&:focus": {
            outline: "2px solid #0066CC",
            outlineOffset: "2px",
          },
        }}
        aria-label="Download data - currently unavailable"
      >
        <DownloadNotAvailableIcon />
        Download
      </Button>
    </Box>
  );
};

export default DownloadServiceCard;

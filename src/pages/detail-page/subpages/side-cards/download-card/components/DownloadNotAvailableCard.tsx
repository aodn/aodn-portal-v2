import { Box, Button, Typography } from "@mui/material";
import rc8Theme from "../../../../../../styles/themeRC8";
import { DownloadNotAvailableIcon } from "../../../../../../assets/icons/download/downloadNotAvaliable";

const DownloadNotAvailableCard = () => {
  return (
    <Box px="16px" py="22px">
      <Box
        sx={{
          borderRadius: "6px",
          border: `1px solid ${rc8Theme.palette.grey600}`,
          background: "#FFF",
          padding: "16px",
          marginBottom: "22px",
        }}
      >
        <Typography
          variant="body2Regular"
          sx={{
            color: rc8Theme.palette.text2,
            textAlign: "center",
            width: "100%",
            display: "block",
          }}
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
          width: "100%",
          height: "38px",
          background: rc8Theme.palette.grey600,
          borderRadius: "6px",
          gap: 1,
          ...rc8Theme.typography.body1Medium,
          "&:disabled": {
            background: rc8Theme.palette.grey600,
            color: "white",
            cursor: "not-allowed",
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

export default DownloadNotAvailableCard;

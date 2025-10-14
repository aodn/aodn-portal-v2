import { FC } from "react";
import { Button, SxProps, Typography } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";
import { DownloadIcon } from "../../../assets/icons/download/download";

interface DownloadButtonProps {
  onDownload: () => void;
  isDownloading?: boolean;
  sx?: SxProps;
}

const DownloadButton: FC<DownloadButtonProps> = ({
  onDownload,
  isDownloading = false,
  sx,
}) => {
  return (
    <Button
      sx={{
        width: "100%",
        backgroundColor: rc8Theme.palette.primary1,
        borderRadius: "6px",
        ":hover": {
          backgroundColor: rc8Theme.palette.primary1,
        },
        cursor: isDownloading ? "not-allowed" : "pointer",
        gap: 1,
        ...sx,
      }}
      onClick={isDownloading ? undefined : () => onDownload()}
    >
      <DownloadIcon />
      <Typography
        typography="title1Medium"
        color={rc8Theme.palette.text3}
        padding={0}
      >
        {isDownloading ? "Downloading..." : "Download"}
      </Typography>
    </Button>
  );
};

export default DownloadButton;

import { FC } from "react";
import {
  Button,
  CircularProgress,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { portalTheme } from "../../../styles";
import { DownloadIcon } from "../../../assets/icons/download/download";
import { formatBytes } from "../../../utils/Helpers";

interface DownloadButtonProps {
  onDownload: () => void;
  isDownloading?: boolean;
  isEstimating?: boolean;
  estimatedSizeBytes?: number | null;
  sx?: SxProps;
}

const getTooltip = (
  isDownloading: boolean,
  isEstimating: boolean,
  estimatedSizeBytes: number | null
) =>
  isDownloading
    ? "Downloading data"
    : isEstimating
      ? "Estimating download size..."
      : estimatedSizeBytes != null
        ? `Download data is approximately ${formatBytes(estimatedSizeBytes)}`
        : "Download data";

const renderButtonLabel = (
  isDownloading: boolean,
  estimatedSizeBytes: number | null
) => (
  <Stack
    direction="row"
    sx={{ flexWrap: "wrap", justifyContent: "center", gap: 0.5 }}
  >
    <Typography
      typography="title1Medium"
      color={portalTheme.palette.text3}
      padding={0}
    >
      {isDownloading ? "Downloading..." : "Download"}
    </Typography>
    {estimatedSizeBytes != null && (
      <Typography
        typography="title1Medium"
        color={portalTheme.palette.text3}
        padding={0}
      >
        {`[~${formatBytes(estimatedSizeBytes)}]`}
      </Typography>
    )}
  </Stack>
);

const DownloadButton: FC<DownloadButtonProps> = ({
  onDownload,
  isDownloading = false,
  isEstimating = false,
  estimatedSizeBytes = null,
  sx,
}) => {
  return (
    <Tooltip
      title={getTooltip(isDownloading, isEstimating, estimatedSizeBytes)}
      placement="top"
    >
      <Button
        sx={{
          width: "100%",
          backgroundColor: portalTheme.palette.primary1,
          borderRadius: "6px",
          ":hover": {
            backgroundColor: portalTheme.palette.primary1,
          },
          cursor: isDownloading ? "not-allowed" : "pointer",
          gap: 1,
          ...sx,
        }}
        onClick={isDownloading ? undefined : () => onDownload()}
      >
        <DownloadIcon />
        {renderButtonLabel(isDownloading, estimatedSizeBytes ?? null)}
        {isEstimating && !isDownloading && (
          <CircularProgress
            size={14}
            thickness={5}
            sx={{ color: portalTheme.palette.text3 }}
          />
        )}
      </Button>
    </Tooltip>
  );
};

export default DownloadButton;

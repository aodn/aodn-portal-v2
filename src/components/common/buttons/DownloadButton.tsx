import { FC } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { portalTheme } from "../../../styles";
import { DownloadIcon } from "../../../assets/icons/download/download";
import { formatBytes } from "../../../utils/Helpers";

interface DownloadButtonProps {
  onDownload: () => void;
  isDownloading?: boolean;
  isEstimating?: boolean;
  estimatedSizeBytes?: number | null;
  handleCancelDownload?: () => void;
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
  handleCancelDownload = () => {},
  sx,
}) => {
  return (
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
      data-testid="download-button"
    >
      <Tooltip
        title={getTooltip(isDownloading, isEstimating, estimatedSizeBytes)}
        placement="top"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={{ flexShrink: 0, display: "flex" }}>
            <DownloadIcon />
          </Box>
          {renderButtonLabel(isDownloading, estimatedSizeBytes ?? null)}
          {isEstimating && !isDownloading && (
            <CircularProgress
              size={14}
              thickness={5}
              sx={{ color: portalTheme.palette.text3 }}
            />
          )}
        </Stack>
      </Tooltip>
      {isDownloading && (
        <Tooltip placement="top" title="Cancel Download">
          <IconButton
            size="small"
            onClick={handleCancelDownload}
            sx={{ color: portalTheme.palette.grey[100] }}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      )}
    </Button>
  );
};

export default DownloadButton;

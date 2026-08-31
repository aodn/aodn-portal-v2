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
  estimateFailed?: boolean;
  disabled?: boolean;
  handleCancelDownload?: () => void;
  sx?: SxProps;
}

const getTooltip = (
  isDownloading: boolean,
  isEstimating: boolean,
  estimatedSizeBytes: number | null,
  estimateFailed: boolean,
  disabled: boolean
) =>
  disabled
    ? "This download is too large — please subset your selection to enable it"
    : isDownloading
      ? "Downloading data"
      : isEstimating
        ? "Estimating download size..."
        : estimatedSizeBytes != null
          ? `Download data is approximately ${formatBytes(estimatedSizeBytes)}`
          : estimateFailed
            ? "Download size could not be estimated, you can still download this data"
            : "Download data";

const renderButtonLabel = (
  isDownloading: boolean,
  estimatedSizeBytes: number | null,
  labelColor: string
) => (
  <Stack
    direction="row"
    sx={{ flexWrap: "wrap", justifyContent: "center", gap: 0.5 }}
  >
    <Typography typography="title1Medium" color={labelColor} padding={0}>
      {isDownloading ? "Downloading..." : "Download"}
    </Typography>
    {estimatedSizeBytes != null && (
      <Typography typography="title1Medium" color={labelColor} padding={0}>
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
  estimateFailed = false,
  disabled = false,
  handleCancelDownload = () => {},
  sx,
}) => {
  const contentColor = disabled
    ? portalTheme.palette.text2
    : portalTheme.palette.text3;

  return (
    <Button
      sx={{
        width: "100%",
        backgroundColor: portalTheme.palette.primary1,
        borderRadius: "6px",
        ":hover": {
          backgroundColor: portalTheme.palette.primary1,
        },
        "&.Mui-disabled, &.Mui-disabled:hover": {
          backgroundColor: portalTheme.palette.primary4,
          pointerEvents: "auto",
          cursor: "not-allowed",
        },
        cursor: isDownloading ? "not-allowed" : "pointer",
        gap: 1,
        ...sx,
      }}
      disabled={disabled}
      onClick={isDownloading || disabled ? undefined : () => onDownload()}
      data-testid="download-button"
    >
      <Tooltip
        title={getTooltip(
          isDownloading,
          isEstimating,
          estimatedSizeBytes,
          estimateFailed,
          disabled
        )}
        placement="top"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={{ flexShrink: 0, display: "flex" }}>
            <DownloadIcon color={contentColor} />
          </Box>
          {renderButtonLabel(
            isDownloading,
            estimatedSizeBytes ?? null,
            contentColor
          )}
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

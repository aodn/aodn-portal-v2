import { FC } from "react";
import {
  Button,
  CircularProgress,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { portalTheme } from "../../../styles";
import { DownloadIcon } from "../../../assets/icons/download/download";

interface DownloadButtonProps {
  onDownload: () => void;
  isDownloading?: boolean;
  isEstimating?: boolean;
  estimatedSizeMB?: number | null;
  sx?: SxProps;
}
const getSizeLabel = (estimatedSizeMB: number | null) =>
  estimatedSizeMB != null ? ` [~${estimatedSizeMB} MB]` : "";

const getButtonLabel = (isDownloading: boolean, sizeLabel: string) =>
  isDownloading ? `Downloading...${sizeLabel}` : `Download${sizeLabel}`;

const getTooltip = (
  isDownloading: boolean,
  isEstimating: boolean,
  estimatedSizeMB: number | null
) =>
  isDownloading
    ? "Downloading data"
    : isEstimating
      ? "Estimating download size..."
      : estimatedSizeMB != null
        ? `Download data is approximately ${estimatedSizeMB} MB`
        : "Download data";

const DownloadButton: FC<DownloadButtonProps> = ({
  onDownload,
  isDownloading = false,
  isEstimating = false,
  estimatedSizeMB = null,
  sx,
}) => {
  return (
    <Tooltip
      title={getTooltip(isDownloading, isEstimating, estimatedSizeMB)}
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
        data-testid="download-button"
      >
        <DownloadIcon />
        <Typography
          typography="title1Medium"
          color={portalTheme.palette.text3}
          padding={0}
        >
          {getButtonLabel(isDownloading, getSizeLabel(estimatedSizeMB ?? null))}
        </Typography>
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

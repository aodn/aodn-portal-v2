import { FC } from "react";
import { Box, SxProps } from "@mui/material";
import InfoMessage from "./InfoMessage";
import { portalTheme } from "@/styles";

// Thresholds are binary (GiB / TiB) so they line up with formatBytes, which
// formats using base 1024 — a download the user sees as "10.5 GB" must not
// fall below the "10 GB" threshold.
const LARGE_DOWNLOAD_BYTES = 10 * 1024 ** 3;
const VERY_LARGE_DOWNLOAD_BYTES = 1024 ** 4;

enum DownloadSizeWarningLevel {
  NONE = "none",
  LARGE = "large",
  VERY_LARGE = "very-large",
  ESTIMATE_FAILED = "estimate-failed",
}

// First-pass wording agreed with the team; expected to change once the
// designer and stakeholders review it
const WARNING_MESSAGES: Record<
  Exclude<DownloadSizeWarningLevel, DownloadSizeWarningLevel.NONE>,
  string
> = {
  [DownloadSizeWarningLevel.LARGE]:
    "The estimated download size is over 10 GB — please subset your selection to reduce it.",
  [DownloadSizeWarningLevel.VERY_LARGE]:
    "The estimated download size is over 1 TB — please subset your selection to keep it under 10 GB.",
  [DownloadSizeWarningLevel.ESTIMATE_FAILED]:
    "The download size could not be estimated — please subset your selection.",
};

interface DownloadSizeWarningInput {
  isEstimating?: boolean;
  estimatedSizeBytes?: number | null;
  estimateFailed?: boolean;
}

interface DownloadSizeWarningProps extends DownloadSizeWarningInput {
  sx?: SxProps;
}

/**
 * Maps the current download-size estimate onto an advisory warning level.
 *
 * Every level is advisory only — the Download button stays enabled in all
 * cases, including a failed estimate.
 */
const getDownloadSizeWarningLevel = ({
  isEstimating = false,
  estimatedSizeBytes = null,
  estimateFailed = false,
}: DownloadSizeWarningInput): DownloadSizeWarningLevel => {
  // An in-flight estimate supersedes whatever the previous one reported, so no
  // stale warning is left on screen while the new size is on its way
  if (isEstimating) {
    return DownloadSizeWarningLevel.NONE;
  }
  if (estimateFailed) {
    return DownloadSizeWarningLevel.ESTIMATE_FAILED;
  }
  if (estimatedSizeBytes == null) {
    return DownloadSizeWarningLevel.NONE;
  }
  if (estimatedSizeBytes >= VERY_LARGE_DOWNLOAD_BYTES) {
    return DownloadSizeWarningLevel.VERY_LARGE;
  }
  if (estimatedSizeBytes >= LARGE_DOWNLOAD_BYTES) {
    return DownloadSizeWarningLevel.LARGE;
  }
  return DownloadSizeWarningLevel.NONE;
};

/**
 * Whether any advisory warning applies. Used by the cards to suppress the
 * subsetting info message so only one advisory shows at a time.
 */
const hasDownloadSizeWarning = (input: DownloadSizeWarningInput): boolean =>
  getDownloadSizeWarningLevel(input) !== DownloadSizeWarningLevel.NONE;

/**
 * Advisory warning shown under the Download button when the estimated size is
 * large, very large, or could not be estimated at all. Renders nothing when
 * the estimate succeeded and is small enough.
 */
const DownloadSizeWarning: FC<DownloadSizeWarningProps> = ({
  isEstimating = false,
  estimatedSizeBytes = null,
  estimateFailed = false,
  sx,
}) => {
  const level = getDownloadSizeWarningLevel({
    isEstimating,
    estimatedSizeBytes,
    estimateFailed,
  });

  if (level === DownloadSizeWarningLevel.NONE) {
    return null;
  }

  return (
    <Box
      data-testid="download-size-warning"
      data-warning-level={level}
      sx={{ width: "100%", ...sx }}
    >
      <InfoMessage
        infoText={WARNING_MESSAGES[level]}
        iconColor={portalTheme.palette.warning.main}
      />
    </Box>
  );
};

export default DownloadSizeWarning;
export {
  DownloadSizeWarningLevel,
  LARGE_DOWNLOAD_BYTES,
  VERY_LARGE_DOWNLOAD_BYTES,
  getDownloadSizeWarningLevel,
  hasDownloadSizeWarning,
};
export type { DownloadSizeWarningInput };

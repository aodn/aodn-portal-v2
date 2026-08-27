import { FC, ReactNode, useCallback } from "react";
import { Box, Link, SxProps } from "@mui/material";
import { useParams } from "react-router-dom";
import InfoMessage from "./InfoMessage";
import { LARGE_DOWNLOAD_BYTES, EXTRA_LARGE_DOWNLOAD_BYTES } from "./constants";
import useTabNavigation from "@/hooks/useTabNavigation";
import { detailPageDefault, pageReferer } from "@/components/common/constants";
import { portalTheme } from "@/styles";

enum DownloadSizeWarningLevel {
  NONE = "none",
  LARGE = "large",
  EXTRA_LARGE = "very-large",
  ESTIMATE_FAILED = "estimate-failed",
}

type ActiveWarningLevel = Exclude<
  DownloadSizeWarningLevel,
  DownloadSizeWarningLevel.NONE
>;

const WARNING_ICON_COLOURS: Record<ActiveWarningLevel, string> = {
  [DownloadSizeWarningLevel.LARGE]: portalTheme.palette.warning.main,
  [DownloadSizeWarningLevel.ESTIMATE_FAILED]: portalTheme.palette.warning.main,
  [DownloadSizeWarningLevel.EXTRA_LARGE]: portalTheme.palette.error.main,
};

const WARNING_MESSAGES: Record<
  Exclude<ActiveWarningLevel, DownloadSizeWarningLevel.EXTRA_LARGE>,
  string
> = {
  [DownloadSizeWarningLevel.LARGE]:
    "The estimated download size is over 10 GB — please subset your selection to reduce it.",
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
 * Maps the current download-size estimate onto a warning level.
 *
 * Only VERY_LARGE blocks the download; LARGE and ESTIMATE_FAILED are advisory
 * and leave the Download button enabled.
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
  if (estimatedSizeBytes >= EXTRA_LARGE_DOWNLOAD_BYTES) {
    return DownloadSizeWarningLevel.EXTRA_LARGE;
  }
  if (estimatedSizeBytes >= LARGE_DOWNLOAD_BYTES) {
    return DownloadSizeWarningLevel.LARGE;
  }
  return DownloadSizeWarningLevel.NONE;
};

const hasDownloadSizeWarning = (input: DownloadSizeWarningInput): boolean =>
  getDownloadSizeWarningLevel(input) !== DownloadSizeWarningLevel.NONE;

const isDownloadBlocked = (input: DownloadSizeWarningInput): boolean =>
  getDownloadSizeWarningLevel(input) === DownloadSizeWarningLevel.EXTRA_LARGE;

const renderWarningMessage = (
  level: ActiveWarningLevel,
  onShowDataAccess: () => void
): ReactNode => {
  if (level !== DownloadSizeWarningLevel.EXTRA_LARGE) {
    return WARNING_MESSAGES[level];
  }
  return (
    <>
      Download is unavailable because the selected dataset is too large (greater
      than 1TB). Please refine your selection to reduce the dataset size, or use
      one of the alternative data access methods available{" "}
      <Link
        component="button"
        type="button"
        onClick={onShowDataAccess}
        data-testid="download-size-warning-data-access-link"
        // Keep the button flowing inline with the surrounding sentence
        sx={{ font: "inherit", verticalAlign: "baseline" }}
      >
        here
      </Link>
      .
    </>
  );
};

/**
 * Warning shown under the Download button when the estimated size is large,
 * very large, or could not be estimated at all. Renders nothing when the
 * estimate succeeded and is small enough.
 */
const DownloadSizeWarning: FC<DownloadSizeWarningProps> = ({
  isEstimating = false,
  estimatedSizeBytes = null,
  estimateFailed = false,
  sx,
}) => {
  const { uuid } = useParams();
  const tabNavigation = useTabNavigation();

  const onShowDataAccess = useCallback(() => {
    if (!uuid) return;
    tabNavigation(
      uuid,
      detailPageDefault.DATA_ACCESS,
      pageReferer.DETAIL_PAGE_REFERER
    );
  }, [tabNavigation, uuid]);

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
        infoText={renderWarningMessage(level, onShowDataAccess)}
        iconColor={WARNING_ICON_COLOURS[level]}
      />
    </Box>
  );
};

export default DownloadSizeWarning;
export {
  DownloadSizeWarningLevel,
  getDownloadSizeWarningLevel,
  hasDownloadSizeWarning,
  isDownloadBlocked,
};
export type { DownloadSizeWarningInput };

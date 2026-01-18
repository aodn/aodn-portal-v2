import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { borderRadius } from "../../../../../../styles/constants";
import { ILink } from "../../../../../../components/common/store/OGCCollectionDefinitions";
import { portalTheme } from "../../../../../../styles";
import useWFSDownload, {
  DownloadStatus,
} from "../../../../../../hooks/useWFSDownload";
import {
  DownloadCondition,
  DownloadConditionType,
  FormatCondition,
} from "../../../../context/DownloadDefinitions";
import InfoMessage from "./InfoMessage";
import DownloadButton from "../../../../../../components/common/buttons/DownloadButton";
import DownloadSubsetting from "./DownloadSubsetting";
import DownloadSelect from "./DownloadSelect";
import { trackCustomEvent } from "../../../../../../analytics/customEventTracker";
import { AnalyticsEvent } from "../../../../../../analytics/analyticsEvents";
import { formWmsLinkOptions } from "../../../../../../components/map/mapbox/layers/GeoServerLayer";

// Currently only CSV is supported for WFS downloading
// TODO:the format options will be fetched from the backend in the future
const formatOptions = [{ label: "CSV", value: "csv" }];

interface DownloadWFSCardProps extends DownloadCondition {
  WFSLinks: ILink[] | undefined;
  WMSLinks: ILink[] | undefined;
  selectedWmsLayerName: string | undefined;
  uuid?: string;
}

const DownloadWFSCard: FC<DownloadWFSCardProps> = ({
  WFSLinks,
  WMSLinks,
  selectedWmsLayerName,
  uuid,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
}) => {
  const {
    downloadingStatus,
    downloadedBytes,
    progressMessage,
    startDownload,
    cancelDownload,
    formatBytes,
    isDownloading,
  } = useWFSDownload(() => setSnackbarOpen(true));
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedDataItem, setSelectedDataItem] = useState<string | undefined>(
    undefined
  );
  const [selectedFormat, setSelectedFormat] = useState<string>(
    formatOptions[0].value
  );

  // For now we just display the wms layer to make sure the download data is associated with the geoserver layer
  // And hide all the wfs layers if there is a wms layer
  // Will display all the wfs layers if there is no wms layer
  const dataSelectOptions = useMemo(() => {
    if (selectedWmsLayerName) {
      setSelectedDataItem(selectedWmsLayerName);
      return [{ value: selectedWmsLayerName, label: selectedWmsLayerName }];
    }

    if (WMSLinks && WMSLinks.length > 0) {
      return formWmsLinkOptions(WFSLinks);
    }
    return (WFSLinks ?? []).map((link) => ({
      value: link.title,
      label: link.title,
    }));
  }, [WFSLinks, WMSLinks, selectedWmsLayerName]);

  const handleSelectFormat = useCallback(
    (value: string) => {
      setSelectedFormat(value);
      getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
        new FormatCondition("format", value),
      ]);
    },
    [getAndSetDownloadConditions]
  );

  const handleSelectDataItem = useCallback((value: string) => {
    setSelectedDataItem(value);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!selectedDataItem || !uuid) return;

    // WFS download tracking
    trackCustomEvent(AnalyticsEvent.DOWNLOAD_WFS_DATA, {
      wfs_download_uuid: uuid,
      wfs_download_data_selection: selectedDataItem,
      wfs_download_format: selectedFormat,
    });

    await startDownload(uuid, selectedDataItem, downloadConditions);
  }, [
    selectedDataItem,
    selectedFormat,
    uuid,
    startDownload,
    downloadConditions,
  ]);

  const handleCancelDownload = useCallback(() => {
    cancelDownload();
  }, [cancelDownload]);

  useEffect(() => {
    // set default format
    getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
      new FormatCondition("format", formatOptions[0].value),
    ]);
  }, [getAndSetDownloadConditions]);

  const renderProgressMessage = useCallback(
    (dataSize: string, progressMessage: string) => {
      return (
        <Stack spacing={1}>
          <LinearProgress
            variant="indeterminate"
            sx={{
              height: 8,
              borderRadius: borderRadius.small,
              backgroundColor: portalTheme.palette.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: portalTheme.palette.primary.main,
              },
            }}
          />
          <Grid container>
            {downloadedBytes > 0 ? (
              <>
                <Grid item xs={6}>
                  <Typography
                    textAlign="right"
                    sx={{ ...portalTheme.typography.body3Small }}
                  >
                    Downloaded:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    width="60%"
                    textAlign="left"
                    sx={{ ...portalTheme.typography.body3Small }}
                  >
                    {dataSize}
                  </Typography>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="left"
                >
                  {progressMessage || "Preparing download..."}
                </Typography>
              </Grid>
            )}
          </Grid>
          <InfoMessage
            infoText="Please don't leave the page while the download is processing"
            iconColor={portalTheme.palette.warning.main}
          />
        </Stack>
      );
    },
    [downloadedBytes]
  );

  return (
    <Stack direction="column">
      {/* TODO: Add download dialog in the future  */}
      {/* <DownloadDialog
        isOpen={downloadDialogOpen}
        setIsOpen={setDownloadDialogOpen}
      /> */}
      <Stack sx={{ p: "16px" }} spacing={2}>
        <DownloadSelect
          disabled={isDownloading}
          items={formatOptions}
          label="Format Selection"
          value={selectedFormat}
          onSelectCallback={handleSelectFormat}
        />
        <DownloadSelect
          disabled={isDownloading}
          items={dataSelectOptions}
          label="Data Selection"
          value={selectedDataItem}
          onSelectCallback={handleSelectDataItem}
        />
        <Box position="relative">
          <DownloadButton
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
          {isDownloading && (
            <Box sx={{ position: "absolute", right: 1, top: 1 }}>
              <Tooltip placement="top" title="Cancel Download">
                <IconButton
                  size="small"
                  onClick={handleCancelDownload}
                  sx={{ color: portalTheme.palette.grey[100] }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        {isDownloading &&
          renderProgressMessage(formatBytes(downloadedBytes), progressMessage)}
      </Stack>

      <DownloadSubsetting
        downloadConditions={downloadConditions}
        getAndSetDownloadConditions={getAndSetDownloadConditions}
        removeDownloadCondition={removeDownloadCondition}
        hideInfoMessage={isDownloading}
        disable={isDownloading}
        sx={{ px: "16px" }}
      />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          // Only close on timeout or explicit close, not on clickaway
          // This prevents the snackbar from closing when user clicks cancelDownload button
          if (reason !== "clickaway") {
            setSnackbarOpen(false);
          }
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            downloadingStatus === DownloadStatus.ERROR
              ? "error"
              : downloadingStatus === DownloadStatus.COMPLETED
                ? "success"
                : "info"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {progressMessage || downloadingStatus}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default DownloadWFSCard;

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
  useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  border,
  borderRadius,
  color,
  padding,
} from "../../../../../../styles/constants";
import CommonSelect from "../../../../../../components/common/dropdown/CommonSelect";
import { ILink } from "../../../../../../components/common/store/OGCCollectionDefinitions";
import rc8Theme from "../../../../../../styles/themeRC8";
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

// Currently only CSV is supported for WFS downloading
// TODO:the format options will be fetched from the backend in the future
const formatOptions = [{ label: "CSV", value: "csv" }];

interface DownloadWFSCardProps extends DownloadCondition {
  WFSLinks: ILink[] | undefined;
  WMSLinks: ILink[] | undefined;
  uuid?: string;
}

const DownloadWFSCard: FC<DownloadWFSCardProps> = ({
  WFSLinks,
  WMSLinks,
  uuid,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
}) => {
  const theme = useTheme();
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
    WMSLinks?.[0]?.title
  );
  const [selectedFormat, setSelectedFormat] = useState<string>(
    formatOptions[0].value
  );

  const selectSxProps = useMemo(
    () => ({
      height: "30px",
      textAlign: "start",
      backgroundColor: "transparent",
      boxShadow: theme.shadows[5],
      border: `${border.xs} ${color.blue.dark}`,
    }),
    [theme]
  );

  // For now we just display the wms layer to make sure the download data is associated with the geoserver layer
  // And hide all the wfs layers if there is a wms layer
  // Will display all the wfs layers if there is no wms layer
  const dataSelectOptions = useMemo(() => {
    if (WMSLinks && WMSLinks.length > 0) {
      return WMSLinks.map((link) => ({
        value: link.title,
        label: link.title,
      }));
    }
    return (WFSLinks ?? []).map((link) => ({
      value: link.title,
      label: link.title,
    }));
  }, [WFSLinks, WMSLinks]);

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
    await startDownload(uuid, selectedDataItem, downloadConditions);
  }, [selectedDataItem, uuid, startDownload, downloadConditions]);

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
              backgroundColor: rc8Theme.palette.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: rc8Theme.palette.primary.main,
              },
            }}
          />
          <Grid container>
            {downloadedBytes > 0 ? (
              <>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="right"
                  >
                    Downloaded:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    width="60%"
                    variant="body2"
                    color="textSecondary"
                    textAlign="left"
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
            iconColor={rc8Theme.palette.warning.main}
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
      <Stack sx={{ padding: padding.medium }} spacing={2}>
        <CommonSelect
          items={formatOptions}
          label="Format Selection"
          value={selectedFormat}
          onSelectCallback={handleSelectFormat}
          sx={selectSxProps}
          disabled={isDownloading}
        />
        <CommonSelect
          items={dataSelectOptions}
          label="Data Selection"
          value={selectedDataItem}
          onSelectCallback={handleSelectDataItem}
          sx={selectSxProps}
          disabled={isDownloading}
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
                  sx={{ color: rc8Theme.palette.grey[100] }}
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

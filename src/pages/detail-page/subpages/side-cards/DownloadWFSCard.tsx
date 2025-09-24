import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  border,
  borderRadius,
  color,
  padding,
} from "../../../../styles/constants";
import CommonSelect from "../../../../components/common/dropdown/CommonSelect";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import rc8Theme from "../../../../styles/themeRC8";
import useWFSDownload, {
  DownloadStatus,
} from "../../../../hooks/useWFSDownload";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import { useDetailPageContext } from "../../context/detail-page-context";
import DataSelection from "../../../../components/download/DataSelection";
import {
  DownloadConditionType,
  FormatCondition,
} from "../../context/DownloadDefinitions";
import SubsettingMessage from "./SubsettingMessage";

const options = [
  // { label: "NetCDFs", value: "NetCDFs" },
  // Currently only CSV is supported for WFS downloading
  { label: "CSV", value: "csv" },
];

interface DownloadWFSCardProps {
  WFSLinks: ILink[];
  uuid?: string;
}

const DownloadWFSCard: FC<DownloadWFSCardProps> = ({ WFSLinks, uuid }) => {
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  const { downloadConditions, getAndSetDownloadConditions } =
    useDetailPageContext();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedDataItem, setSelectedDataItem] = useState<string | undefined>(
    WFSLinks[0]?.title
  );
  const [selectedFormat, setSelectedFormat] = useState<string>(
    options[0].value
  );
  const {
    downloadingStatus,
    downloadedBytes,
    progressMessage,
    startDownload,
    cancelDownload,
    formatBytes,
    isDownloading,
  } = useWFSDownload(() => setSnackbarOpen(true));

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

  const WFSOptions = useMemo(
    () => WFSLinks.map((link) => ({ value: link.title, label: link.title })),
    [WFSLinks]
  );

  // Store the filtered download conditions count
  const subsettingSelectionCount = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type !== DownloadConditionType.FORMAT
    ).length;
  }, [downloadConditions]);

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
      new FormatCondition("format", options[0].value),
    ]);
  }, [getAndSetDownloadConditions]);

  return (
    <Stack direction="column">
      {/* TODO: Add download dialog in the future  */}
      {/* <DownloadDialog
        isOpen={downloadDialogOpen}
        setIsOpen={setDownloadDialogOpen}
      /> */}
      <Stack sx={{ padding: padding.medium }} spacing={2}>
        <CommonSelect
          items={options}
          label="Select format"
          value={selectedFormat}
          onSelectCallback={handleSelectFormat}
          sx={selectSxProps}
          disabled={isDownloading}
        />
        <CommonSelect
          items={WFSOptions}
          label="Select data"
          value={selectedDataItem}
          onSelectCallback={handleSelectDataItem}
          sx={selectSxProps}
          disabled={isDownloading}
        />
        <Box position="relative">
          <Button
            sx={{
              width: "100%",
              backgroundColor: rc8Theme.palette.primary.main,
              borderRadius: borderRadius.small,
              ":hover": {
                backgroundColor: rc8Theme.palette.primary.main,
              },
              cursor: isDownloading ? "not-allowed" : "pointer",
            }}
            onClick={isDownloading ? undefined : () => handleDownload()}
          >
            <Typography padding={0} color="#fff">
              {isDownloading ? "Downloading..." : "Download WFS Data"}
            </Typography>
          </Button>
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

        {isDownloading && (
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
                      {formatBytes(downloadedBytes)}
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
          </Stack>
        )}
      </Stack>
      <Divider sx={{ width: "100%" }} />
      {subsettingSelectionCount >= 1 ? (
        <PlainAccordion
          expanded={accordionExpanded}
          elevation={0}
          onChange={() => setAccordionExpanded((prevState) => !prevState)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={3}>
              <Typography
                typography="title1Medium"
                color={rc8Theme.palette.text1}
                p={0}
              >
                Data Selection
              </Typography>
              <Badge
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: rc8Theme.palette.primary1,
                    ...rc8Theme.typography.title2Regular,
                    color: rc8Theme.palette.text3,
                    pb: "1px",
                  },
                }}
                badgeContent={subsettingSelectionCount}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: "4px" }}>
            <DataSelection />
          </AccordionDetails>
        </PlainAccordion>
      ) : (
        <SubsettingMessage />
      )}

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

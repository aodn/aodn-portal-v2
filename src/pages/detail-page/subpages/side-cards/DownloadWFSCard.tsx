import { FC, useCallback, useMemo, useState } from "react";
import {
  Alert,
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

// TODO: options should fetch from wfs server
const options = [
  // { label: "NetCDFs", value: "NetCDFs" },
  { label: "CSV", value: "csv" },
];

interface DownloadWFSCardProps {
  WFSLinks: ILink[];
  uuid?: string;
}

const DownloadWFSCard: FC<DownloadWFSCardProps> = ({ WFSLinks, uuid }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedDataItem, setSelectedDataItem] = useState<string | undefined>(
    WFSLinks[0]?.title
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

  const WFSOptions = useMemo(
    () => WFSLinks.map((link) => ({ value: link.title, label: link.title })),
    [WFSLinks]
  );

  const handleSelectDataItem = useCallback((value: string | undefined) => {
    setSelectedDataItem(value);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!selectedDataItem || !uuid) {
      console.error("Missing required parameters");
      return;
    }

    await startDownload(uuid, selectedDataItem);
  }, [selectedDataItem, uuid, startDownload]);

  const handleCancelDownload = useCallback(() => {
    cancelDownload();
  }, [cancelDownload]);

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
        <Button
          sx={{
            position: "relative",
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
          {isDownloading && (
            <Box sx={{ position: "absolute", right: 1 }}>
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
        </Button>
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
      {/* TODO: Add this block back when we need data-selection for WFS download */}
      {/* <PlainAccordion
        expanded={accordionExpanded}
        elevation={0}
        onChange={() => setAccordionExpanded((prevState) => !prevState)}
      >
        <AccordionSummary
          sx={{ paddingX: padding.medium }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Badge color="primary" badgeContent={downloadConditions.length}>
            <Typography
              fontWeight={fontWeight.bold}
              color={fontColor.gray.medium}
              sx={{ padding: 0, marginRight: "10px" }}
            >
              Data Selection
            </Typography>
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          <DataSelection />
        </AccordionDetails>
      </PlainAccordion> */}
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

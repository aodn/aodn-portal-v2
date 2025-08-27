import { FC, useCallback, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  border,
  borderRadius,
  color,
  padding,
} from "../../../../styles/constants";
import CommonSelect, {
  SelectItem,
} from "../../../../components/common/dropdown/CommonSelect";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import rc8Theme from "../../../../styles/themeRC8";

// TODO: options should fetch from wfs server
const options = [
  // { label: "NetCDFs", value: "NetCDFs" },
  { label: "CSV", value: "csv" },
];

enum DownloadStatus {
  NOT_STARTED = "Download not started",
  IN_PROGRESS = "Downloading in progress",
  COMPLETED = "Download completed",
  ERROR = "Download error",
  FAILED = "Download failed",
  FINISHED = "Download finished",
}

interface DownloadWFSCardProps {
  WFSLinks: ILink[];
  uuid?: string;
}

const DownloadWFSCard: FC<DownloadWFSCardProps> = ({ WFSLinks, uuid }) => {
  const theme = useTheme();
  const [selectedDataItem, setSelectedDataItem] = useState<string | undefined>(
    WFSLinks[0]?.title
  );
  const [downloadingStatus, setDownloadingStatus] = useState<DownloadStatus>(
    DownloadStatus.NOT_STARTED
  );
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const WFSOptions: SelectItem<string>[] = useMemo(
    () =>
      WFSLinks.map((link) => {
        return { value: link.title, label: link.title } as SelectItem<string>;
      }),
    [WFSLinks]
  );

  const handleSelectDataItem = useCallback(
    (value: string | undefined) => {
      setSelectedDataItem(value);
    },
    [setSelectedDataItem]
  );

  const handleDownloadWithFetch = useCallback(
    async (selectedDataItem: string | undefined) => {
      setDownloadingStatus(DownloadStatus.IN_PROGRESS);
      setDownloadedBytes(0);
      setSnackbarOpen(true);

      const selectedLink = WFSLinks.find(
        (link) => link.title === selectedDataItem
      );

      if (!selectedLink?.title || !uuid) {
        console.error("UUID or layer name is not provided for download");
        setDownloadingStatus(DownloadStatus.ERROR);
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

        const response = await fetch(
          "/api/v1/ogc/processes/downloadWfs/execution",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: {
                uuid: uuid,
                recipient: "",
                layer_name: selectedLink.title,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Showing actual bytes downloaded
        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          const value = result.value;

          if (done || !value) break;

          chunks.push(value);
          receivedLength += value.length;

          // Update downloaded bytes for UI display
          setDownloadedBytes(receivedLength);
        }

        // Combine chunks into single Uint8Array
        const allChunks = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          allChunks.set(chunk, position);
          position += chunk.length;
        }

        // Create blob and download
        const blob = new Blob([allChunks]);
        downloadFile(blob, generateFileName(selectedLink.title));

        setDownloadingStatus(DownloadStatus.COMPLETED);
        setSnackbarOpen(true);
      } catch (error) {
        setDownloadingStatus(DownloadStatus.ERROR);
        setSnackbarOpen(true);
        setDownloadedBytes(0);
        console.error("Download request failed:", error);
        throw error;
      }
    },
    [WFSLinks, uuid]
  );

  // Helper function to format bytes for display
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper function to generate appropriate filename
  const generateFileName = (layerName: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const sanitizedLayerName = layerName.replace(/[^a-z0-9]/gi, "_");
    return `${sanitizedLayerName}_${timestamp}.csv`;
  };

  // Helper function to handle file download
  const downloadFile = (blob: Blob, filename: string) => {
    // Create blob URL
    const url = window.URL.createObjectURL(blob);

    // Create temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL to free memory
    window.URL.revokeObjectURL(url);
  };

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
        />
        <CommonSelect
          items={WFSOptions}
          label="Select data"
          value={selectedDataItem}
          onSelectCallback={handleSelectDataItem}
          sx={selectSxProps}
        />
        <Button
          disabled={downloadingStatus === DownloadStatus.IN_PROGRESS}
          sx={{
            backgroundColor: rc8Theme.palette.primary.main,
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: rc8Theme.palette.primary.main,
            },
          }}
          onClick={() => handleDownloadWithFetch(selectedDataItem)}
        >
          <Typography padding={0} color="#fff">
            {downloadingStatus === DownloadStatus.IN_PROGRESS
              ? "Downloading..."
              : "Download WFS Data"}
          </Typography>
        </Button>
        {downloadingStatus === DownloadStatus.IN_PROGRESS && (
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
                    Preparing download...
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
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            downloadingStatus === DownloadStatus.ERROR
              ? "error"
              : downloadingStatus === DownloadStatus.IN_PROGRESS
                ? "info"
                : "success"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {downloadingStatus}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default DownloadWFSCard;

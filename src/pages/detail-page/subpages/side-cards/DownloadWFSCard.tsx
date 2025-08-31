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

  const handleDownloadClick = useCallback(async () => {
    if (!selectedDataItem || !uuid) {
      console.error("Missing required parameters");
      return;
    }

    await startDownload(uuid, selectedDataItem);
  }, [selectedDataItem, uuid, startDownload]);

  const handleCancelClick = useCallback(() => {
    cancelDownload();
    setSnackbarOpen(true);
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
          disabled={isDownloading}
          sx={{
            backgroundColor: rc8Theme.palette.primary.main,
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: rc8Theme.palette.primary.main,
            },
          }}
          onClick={() => handleDownloadClick()}
        >
          <Typography padding={0} color="#fff">
            {isDownloading ? "Downloading..." : "Download WFS Data"}
          </Typography>
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
        onClose={() => setSnackbarOpen(false)}
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

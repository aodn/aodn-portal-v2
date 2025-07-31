import { FC, useCallback, useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
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
import axios from "axios";

// TODO: options should fetch from wfs server
const options = [
  // { label: "NetCDFs", value: "NetCDFs" },
  { label: "CSV", value: "csv" },
];

// example url: "https://geoserver-123.aodn.org.au/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=imos:aatams_sattag_dm_profile_map&outputFormat=text/csv"
const WFSBaseUrl = "https://geoserver-123.aodn.org.au/geoserver/ows";
const WFSParam = {
  service: "WFS",
  version: "2.0.0",
  request: "GetFeature",
  typeName: "imos:aatams_sattag_dm_profile_map",
  outputFormat: "text/csv",
};

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
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  // const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  // const { downloadConditions, collection } = useDetailPageContext();
  // const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

  // const onDownload = useCallback(() => {
  //   setDownloadDialogOpen(true);
  // }, []);

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
  const handleDownload = useCallback(
    async (selectedDataItem: string | undefined) => {
      setDownloadingStatus(DownloadStatus.IN_PROGRESS);
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
        const response = await axios.post(
          "/api/v1/ogc/processes/downloadWfs/execution",
          {
            inputs: {
              uuid: uuid,
              recipient: "",
              layer_name: selectedLink.title,
            },
          },
          { responseType: "blob" }
        );

        // Handle successful response
        downloadFile(response.data, generateFileName(selectedLink.title));

        setDownloadingStatus(DownloadStatus.COMPLETED);
        setSnackbarOpen(true);
        return response.data;
      } catch (error) {
        // Handle error
        setDownloadingStatus(DownloadStatus.ERROR);
        setSnackbarOpen(true);
        console.error("Download request failed:", error);
        throw error;
      }
    },
    [WFSLinks, uuid]
  );

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
            backgroundColor: theme.palette.primary.main,
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
          onClick={() => handleDownload(selectedDataItem)}
        >
          {downloadingStatus === DownloadStatus.IN_PROGRESS ? (
            <CircularProgress size="24px" sx={{ color: "#fff" }} />
          ) : (
            <Typography padding={0} color="#fff">
              Download WFS Data
            </Typography>
          )}
        </Button>
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

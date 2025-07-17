import { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
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
import { formatToUrl } from "../../../../utils/UrlUtils";

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
}

const DownloadWFSCard: FC<DownloadWFSCardProps> = ({ WFSLinks }) => {
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

  const handleDownload = useCallback((value: string | undefined) => {
    setDownloadingStatus(DownloadStatus.IN_PROGRESS);
    setSnackbarOpen(true);
    console.log("Download initiated for WFS data", value);
    if (!value) {
      console.error("No data selected for download");
      return;
    }
    const url = formatToUrl({
      baseUrl: WFSBaseUrl,
      params: {
        ...WFSParam,
        typeName: `imos:${value}`,
      },
    });
    try {
      // Direct download - let the browser handle it
      window.open(url, "_blank");

      // Alternative approach:
      // window.location.href = url;

      console.log("Download initiated successfully");
    } catch (err) {
      setDownloadingStatus(DownloadStatus.ERROR);
      console.log("Download error", err);
    } finally {
      setSnackbarOpen(false);
      setDownloadingStatus(DownloadStatus.COMPLETED);
    }
  }, []);

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
          <Typography padding={0} color="#fff">
            {downloadingStatus === DownloadStatus.IN_PROGRESS
              ? "Downloading in progress"
              : "Download WFS Data"}
          </Typography>
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
        onClose={() => setSnackbarOpen(false)}
        message={downloadingStatus}
      />
    </Stack>
  );
};

export default DownloadWFSCard;

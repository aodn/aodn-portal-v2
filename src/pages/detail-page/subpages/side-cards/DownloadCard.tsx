import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontWeight,
  padding,
} from "../../../../styles/constants";
import rc8Theme from "../../../../styles/themeRC8";
import SideCardContainer from "./SideCardContainer";
import { DownloadNotAvailableIcon } from "../../../../assets/icons/download/downloadNotAvaliable";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonSelect from "../../../../components/common/dropdown/CommonSelect";
import { useDetailPageContext } from "../../context/detail-page-context";
import DownloadDialog from "../../../../components/download/DownloadDialog";
import DataSelection from "../../../../components/download/DataSelection";
import {
  DownloadConditionType,
  FormatCondition,
} from "../../context/DownloadDefinitions";
import { DatasetType } from "../../../../components/common/store/OGCCollectionDefinitions";
import { DownloadIcon } from "../../../../assets/icons/download/download";
import { InformationIcon } from "../../../../assets/icons/download/information";

const downloadFormats = [
  { label: "NetCDFs", value: "netcdf" },
  { label: "CSV", value: "csv" },
];

interface DownloadCardProps {
  hasSummaryFeature?: boolean;
}

const DownloadCard = ({ hasSummaryFeature = true }: DownloadCardProps) => {
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  const { collection, downloadConditions, getAndSetDownloadConditions } =
    useDetailPageContext();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

  const onDownload = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);

  // Currently, csv is the best format for parquet datasets, and netcdf is the best for zarr datasets.
  // we will support more formats in the future, but for now, we filter the formats based on the dataset type.
  const filteredDownloadFormats = useMemo(() => {
    const datasetType = collection?.getDatasetType();
    if (!datasetType) {
      return downloadFormats;
    }
    if (datasetType === DatasetType.PARQUET) {
      return downloadFormats.filter((format) => format.value === "csv");
    }
    if (datasetType === DatasetType.ZARR) {
      return downloadFormats.filter((format) => format.value === "netcdf");
    }
    return downloadFormats;
  }, [collection]);

  useEffect(() => {
    // set default format
    if (
      downloadConditions.filter(
        (condition) => condition.type === DownloadConditionType.FORMAT
      ).length === 0
    ) {
      getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
        new FormatCondition("format", "netcdf"),
      ]);
    }
  }, [downloadConditions, getAndSetDownloadConditions]);

  const onSelectChange = useCallback(
    (value: string) => {
      getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
        new FormatCondition("format", value),
      ]);
    },
    [getAndSetDownloadConditions]
  );

  const selectSxProps = useMemo(
    () => ({
      height: "38px",
      textAlign: "start",
      backgroundColor: "transparent",
      boxShadow: theme.shadows[5],
      border: `${border.xs} ${color.blue.dark}`,
    }),
    [theme]
  );

  // Render content when download is available (hasSummaryFeature = true)
  const renderDownload = () => (
    <>
      <DownloadDialog
        isOpen={downloadDialogOpen}
        setIsOpen={setDownloadDialogOpen}
      />
      <Stack sx={{ px: "16px", pt: "22px" }} spacing={2}>
        <CommonSelect
          items={filteredDownloadFormats}
          sx={selectSxProps}
          onSelectCallback={onSelectChange}
        />
        <Button
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: theme.palette.primary.main,
            },
            gap: 1,
          }}
          onClick={onDownload}
        >
          <DownloadIcon />
          <Typography
            typography="title1Medium"
            color={rc8Theme.palette.text3}
            padding={0}
          >
            Download
          </Typography>
        </Button>
      </Stack>

      {/* todo: add subsetting logic */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          py: "12px",
          px: "16px",
        }}
      >
        <Box sx={{ minWidth: 22, flexShrink: 0, px: "8px" }}>
          <InformationIcon
            color={rc8Theme.palette.secondary1}
            height={24}
            width={24}
          />
        </Box>
        <Typography variant="body2" color={rc8Theme.palette.text2} pt="3px">
          Please consider subsetting your download selection using the tools on
          the map.
        </Typography>
      </Box>

      <Divider sx={{ width: "100%" }} />
      <PlainAccordion
        expanded={accordionExpanded}
        elevation={0}
        onChange={() => setAccordionExpanded((prevState) => !prevState)}
      >
        <AccordionSummary
          sx={{ paddingX: padding.medium }}
          expandIcon={<ExpandMoreIcon />}
        >
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
              badgeContent={
                // the count here should exclude the format condition
                downloadConditions.filter(
                  (condition) => condition.type !== DownloadConditionType.FORMAT
                ).length
              }
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: "4px" }}>
          <DataSelection />
        </AccordionDetails>
      </PlainAccordion>
    </>
  );

  // Render content when download is not available (hasSummaryFeature = false)
  const renderDownloadUnavailable = () => (
    <Box px="16px" py="22px">
      <Box
        sx={{
          borderRadius: "6px",
          border: `1px solid ${rc8Theme.palette.grey600}`,
          background: "#FFF",
          padding: "16px",
          marginBottom: "22px",
        }}
      >
        <Typography
          variant="body2Regular"
          sx={{
            color: rc8Theme.palette.text2,
            textAlign: "center",
            width: "100%",
            display: "block",
          }}
        >
          Data download via this method is not currently available. Please see
          other data access options below.
        </Typography>
      </Box>

      <Button
        disabled
        variant="contained"
        disableElevation
        sx={{
          width: "100%",
          height: "38px",
          background: rc8Theme.palette.grey600,
          borderRadius: "6px",
          gap: 1,
          ...rc8Theme.typography.body1Medium,
          "&:disabled": {
            background: rc8Theme.palette.grey600,
            color: "white",
            cursor: "not-allowed",
          },
        }}
        aria-label="Download data - currently unavailable"
      >
        <DownloadNotAvailableIcon />
        Download
      </Button>
    </Box>
  );

  return (
    <SideCardContainer title="Download Service" px={0} py={0}>
      {hasSummaryFeature ? renderDownload() : renderDownloadUnavailable()}
    </SideCardContainer>
  );
};

export default DownloadCard;

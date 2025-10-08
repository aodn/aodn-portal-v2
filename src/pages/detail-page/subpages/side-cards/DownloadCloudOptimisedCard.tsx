import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import rc8Theme from "../../../../styles/themeRC8";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonSelect from "../../../../components/common/dropdown/CommonSelect";
import DownloadDialog from "../../../../components/download/DownloadDialog";
import DataSelection from "../../../../components/download/DataSelection";
import {
  DownloadConditionType,
  FormatCondition,
} from "../../context/DownloadDefinitions";
import {
  DatasetType,
  OGCCollection,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import { DownloadIcon } from "../../../../assets/icons/download/download";
import SubsettingMessage from "./SubsettingMessage";
import { DownloadCondition } from "./DownloadCard";

const downloadFormats = [
  { label: "NetCDFs", value: "netcdf" },
  { label: "CSV", value: "csv" },
];

interface DownloadCardProps extends DownloadCondition {
  collection: OGCCollection;
}

const DownloadCloudOptimisedCard: FC<DownloadCardProps> = ({
  collection,
  downloadConditions,
  getAndSetDownloadConditions,
}) => {
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

  const selectSxProps = useMemo(
    () => ({
      height: "38px",
      textAlign: "start",
      backgroundColor: "#fff",
      boxShadow: theme.shadows[5],
      border: `1px solid ${rc8Theme.palette.primary1}`,
    }),
    [theme]
  );

  // Store the filtered download conditions count
  const subsettingSelectionCount = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type !== DownloadConditionType.FORMAT
    ).length;
  }, [downloadConditions]);

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

  return (
    <>
      <DownloadDialog
        isOpen={downloadDialogOpen}
        setIsOpen={setDownloadDialogOpen}
      />
      <Stack
        sx={{
          px: "16px",
          py: "22px",
        }}
        spacing={2}
      >
        <CommonSelect
          items={filteredDownloadFormats}
          sx={selectSxProps}
          onSelectCallback={onSelectChange}
        />
        <Button
          sx={{
            backgroundColor: rc8Theme.palette.primary1,
            borderRadius: "6px",
            ":hover": {
              backgroundColor: rc8Theme.palette.primary1,
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

      {/* Show subsetting message when subsettingSelectionCount < 1 */}
      {subsettingSelectionCount < 1 && <SubsettingMessage />}

      <Divider sx={{ width: "100%" }} />

      {/* Hide Data Selection accordion when subsettingSelectionCount < 1 */}
      {subsettingSelectionCount >= 1 && (
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
      )}
    </>
  );
};

export default DownloadCloudOptimisedCard;

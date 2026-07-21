import {
  FC,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { dateDefault } from "../../../../components/common/constants";
import DownloadDialog from "./DownloadDialog/DownloadDialog";
import {
  DownloadCondition,
  DownloadConditionType,
  FormatCondition,
  KeyCondition,
} from "../../context/DownloadDefinitions";
import {
  DatasetType,
  OGCCollection,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import DownloadButton from "../../../../components/common/buttons/DownloadButton";
import DownloadSubsetting from "./DownloadSubsetting";
import DownloadSelect from "./DownloadSelect";
import useEstimateSize from "../../../../hooks/useEstimateSize";
import { processCoEstimateSize } from "../../../../components/common/store/searchReducer";

const downloadFormats = [
  { label: "NetCDFs", value: "netcdf" },
  { label: "CSV", value: "csv" },
  { label: "GeoTIFF", value: "geotiff" },
];

// The CO `estimate-complete` payload reports the size of the actual download
// output in `estimated_output_bytes` (vs `estimated_uncompressed_bytes`)
const getCoEstimatedBytes = (data: {
  estimated_output_bytes?: number;
}): number | undefined => data.estimated_output_bytes;

interface DownloadCardProps extends DownloadCondition {
  collection: OGCCollection;
  selectedCoKey?: string;
  setSelectedCoKey?: (value: string) => void;
}

const DownloadCloudOptimisedCard: FC<DownloadCardProps> = ({
  collection,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
  selectedCoKey,
  setSelectedCoKey,
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);
  const { isEstimating, estimateSize, cancelEstimate, estimatedSizeBytes } =
    useEstimateSize(processCoEstimateSize, getCoEstimatedBytes);

  const dateRangeBounds = useMemo(() => {
    let min = dayjs(dateDefault.min);
    let max = dayjs(dateDefault.max);
    const extent = collection?.getExtent();
    if (extent) {
      const [s, e] = extent.getOverallTemporal();
      if (s) min = dayjs(s, dateDefault.DISPLAY_FORMAT);
      if (e) max = dayjs(e, dateDefault.DISPLAY_FORMAT);
    }
    return { min, max };
  }, [collection]);

  // add datasetselection option
  const [selectedDataItem, setSelectedDataItem] = useState<
    string | undefined
  >();
  const [selectedFormat, setSelectedFormat] = useState<string | undefined>();

  const onDownload = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);
  const dataSelectOptions = useMemo(() => {
    const coKeys = collection?.getAllCOKeys() ?? [];
    return coKeys.map((key) => ({
      value: key,
      label: key.replace(/\.(zarr|parquet)$/i, ""),
    }));
  }, [collection]);

  useEffect(() => {
    if (selectedCoKey && selectedDataItem !== selectedCoKey) {
      const matchedOption = dataSelectOptions.find(
        (opt) => opt.value === selectedCoKey
      );
      if (matchedOption) {
        startTransition(() => {
          setSelectedDataItem(selectedCoKey);
          getAndSetDownloadConditions(DownloadConditionType.KEY, [
            new KeyCondition("key", selectedCoKey),
          ]);
        });
      }
    }
  }, [
    selectedCoKey,
    selectedDataItem,
    dataSelectOptions,
    getAndSetDownloadConditions,
  ]);

  const handleSelectDataItem = useCallback(
    (value: string) => {
      setSelectedDataItem(value);
      getAndSetDownloadConditions(DownloadConditionType.KEY, [
        new KeyCondition("key", value),
      ]);
      if (setSelectedCoKey) {
        setSelectedCoKey(value);
      }
    },
    [getAndSetDownloadConditions, setSelectedCoKey]
  );

  useEffect(() => {
    const hasKeyCondition = downloadConditions.some(
      (condition) => condition.type === DownloadConditionType.KEY
    );

    if (dataSelectOptions.length > 0 && !hasKeyCondition && !selectedCoKey) {
      startTransition(() => {
        const defaultValue = dataSelectOptions[0].value;
        setSelectedDataItem(defaultValue);
        getAndSetDownloadConditions(DownloadConditionType.KEY, [
          new KeyCondition("key", defaultValue),
        ]);
        setSelectedCoKey?.(defaultValue);
      });
    }
  }, [
    dataSelectOptions,
    downloadConditions,
    getAndSetDownloadConditions,
    selectedCoKey,
    setSelectedCoKey,
  ]);

  const filteredDownloadFormats = useMemo(() => {
    // Before a data item is selected, only narrow the formats down when the
    // whole collection shares a single dataset type
    const collectionDatasetTypes = collection?.getDatasetType();
    const datasetType = selectedDataItem
      ? collection?.getDatasetTypeByKey(selectedDataItem)
      : collectionDatasetTypes?.length === 1
        ? collectionDatasetTypes[0]
        : undefined;
    if (!datasetType) {
      return downloadFormats;
    }
    if (datasetType === DatasetType.PARQUET) {
      return downloadFormats.filter((format) => format.value === "csv");
    }
    if (datasetType === DatasetType.ZARR) {
      return downloadFormats.filter(
        (format) => format.value === "netcdf" || format.value === "geotiff"
      );
    }
    return downloadFormats;
  }, [collection, selectedDataItem]);

  // Keep the selected format valid for the current data selection: fall back
  // to the first supported format whenever the current one is not available
  useEffect(() => {
    const validFormat = filteredDownloadFormats.some(
      (format) => format.value === selectedFormat
    )
      ? selectedFormat
      : filteredDownloadFormats[0]?.value;

    if (!validFormat) {
      return;
    }

    const hasMatchingFormatCondition = downloadConditions.some(
      (condition) =>
        condition.type === DownloadConditionType.FORMAT &&
        (condition as FormatCondition).format === validFormat
    );

    if (validFormat !== selectedFormat || !hasMatchingFormatCondition) {
      startTransition(() => {
        setSelectedFormat(validFormat);
        if (!hasMatchingFormatCondition) {
          getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
            new FormatCondition("format", validFormat),
          ]);
        }
      });
    }
  }, [
    filteredDownloadFormats,
    selectedFormat,
    downloadConditions,
    getAndSetDownloadConditions,
  ]);

  const onSelectChange = useCallback(
    (value: string) => {
      setSelectedFormat(value);
      getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
        new FormatCondition("format", value),
      ]);
    },
    [getAndSetDownloadConditions]
  );

  // Re-estimate whenever the selected data item (key) or download conditions
  // (format / subsetting) change
  useEffect(() => {
    if (!collection?.id || !selectedDataItem) return;
    estimateSize({ uuid: collection.id, downloadConditions });
    return () => cancelEstimate();
  }, [
    collection?.id,
    selectedDataItem,
    downloadConditions,
    estimateSize,
    cancelEstimate,
  ]);

  return (
    <Stack>
      <Stack sx={{ p: "16px" }} spacing={2}>
        <DownloadSelect
          label="Data Selection"
          items={dataSelectOptions}
          value={selectedDataItem}
          onSelectCallback={handleSelectDataItem}
        />
        <DownloadSelect
          label="Format Selection"
          items={filteredDownloadFormats}
          value={selectedFormat}
          onSelectCallback={onSelectChange}
        />
        <DownloadButton
          onDownload={onDownload}
          isEstimating={isEstimating}
          estimatedSizeBytes={estimatedSizeBytes}
        />
      </Stack>
      <DownloadSubsetting
        downloadConditions={downloadConditions}
        getAndSetDownloadConditions={getAndSetDownloadConditions}
        removeDownloadCondition={removeDownloadCondition}
        dateRangeBounds={dateRangeBounds}
      />
      <DownloadDialog
        isOpen={downloadDialogOpen}
        setIsOpen={setDownloadDialogOpen}
        downloadConditions={downloadConditions}
        getAndSetDownloadConditions={getAndSetDownloadConditions}
        removeDownloadCondition={removeDownloadCondition}
      />
    </Stack>
  );
};

export default DownloadCloudOptimisedCard;

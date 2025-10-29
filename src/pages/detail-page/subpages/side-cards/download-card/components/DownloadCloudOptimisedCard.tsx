import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import DownloadDialog from "../../../../../../components/download/DownloadDialog";
import {
  DownloadCondition,
  DownloadConditionType,
  FormatCondition,
} from "../../../../context/DownloadDefinitions";
import {
  DatasetType,
  OGCCollection,
} from "../../../../../../components/common/store/OGCCollectionDefinitions";
import DownloadButton from "../../../../../../components/common/buttons/DownloadButton";
import DownloadSubsetting from "./DownloadSubsetting";
import DownloadSelect from "./DownloadSelect";

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
  removeDownloadCondition,
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

  // add datasetselection option
  const [selectedDataItem, setSelectedDataItem] = useState<
    string | undefined
  >();

  const onDownload = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);

  const dataSelectOptions = useMemo(() => {
    const summaryLinks = collection?.links?.filter(
      (link) => link.rel === "summary"
    );

    if (!summaryLinks || summaryLinks.length === 0) {
      return [];
    }

    return summaryLinks.map((link) => ({
      value: link.title,
      label: link.title.replace(/\.(zarr|parquet)$/i, ""),
    }));
  }, [collection]);

  const handleSelectDataItem = useCallback((value: string) => {
    setSelectedDataItem(value);
  }, []);

  useEffect(() => {
    if (dataSelectOptions.length > 0 && !selectedDataItem) {
      setSelectedDataItem(dataSelectOptions[0].value);
    }
  }, [dataSelectOptions, selectedDataItem]);

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
    <Stack direction="column">
      <Stack sx={{ p: "16px" }} spacing={2}>
        <DownloadSelect
          label="Format Selection"
          items={filteredDownloadFormats}
          onSelectCallback={onSelectChange}
        />
        <DownloadSelect
          label="Data Selection"
          items={dataSelectOptions}
          value={selectedDataItem}
          onSelectCallback={handleSelectDataItem}
        />
        <DownloadButton onDownload={onDownload} />
      </Stack>

      <DownloadSubsetting
        downloadConditions={downloadConditions}
        getAndSetDownloadConditions={getAndSetDownloadConditions}
        removeDownloadCondition={removeDownloadCondition}
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

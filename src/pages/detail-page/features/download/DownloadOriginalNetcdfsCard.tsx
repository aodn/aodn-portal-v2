import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import DownloadDialog from "./download-dialog/DownloadDialog";
import {
  DownloadCondition,
  DownloadConditionType,
  FormatCondition,
  KeyCondition,
} from "@/pages/detail-page/context/DownloadDefinitions";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { SelectItem } from "@/components/common/dropdown/CommonSelect";
import DownloadButton from "@/components/common/buttons/DownloadButton";
import DownloadSubsetting from "./DownloadSubsetting";
import DownloadSelect from "./DownloadSelect";
import DownloadSourceChip from "./DownloadSourceChip";

// The user gets an email with a csv list of the netcdf file links
const formatOptions = [{ label: "CSV", value: "csv" }];

// Shown to the user instead of the raw link title
const DATA_SELECTION_LABEL = "List of NetCDFs";

interface DownloadOriginalNetcdfsCardProps extends DownloadCondition {
  collection: OGCCollection;
  isImosOnly?: boolean;
  isIntegrated?: boolean;
}

// Download for a collection with no cloud optimised data. Size estimate is
// not supported yet, so the button shows no size.
const DownloadOriginalNetcdfsCard: FC<DownloadOriginalNetcdfsCardProps> = ({
  collection,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
  isImosOnly,
  isIntegrated,
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

  // One option only: the link title is the key sent to the backend
  const dataSelectOptions = useMemo<SelectItem[]>(() => {
    const title = collection.getOriginalNetcdfsLink()?.title;
    return title ? [{ value: title, label: DATA_SELECTION_LABEL }] : [];
  }, [collection]);
  const selectedDataItem = dataSelectOptions[0]?.value;
  const selectedFormat = formatOptions[0].value;

  useEffect(() => {
    if (!selectedDataItem) return;
    getAndSetDownloadConditions(DownloadConditionType.KEY, [
      new KeyCondition("key", selectedDataItem),
    ]);
  }, [selectedDataItem, getAndSetDownloadConditions]);

  useEffect(() => {
    getAndSetDownloadConditions(DownloadConditionType.FORMAT, [
      new FormatCondition("format", selectedFormat),
    ]);
  }, [selectedFormat, getAndSetDownloadConditions]);

  const onDownload = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);

  return (
    <Stack>
      <Stack sx={{ p: "16px" }} spacing={2}>
        <DownloadSelect
          label="Data Selection"
          labelAdornment={
            <DownloadSourceChip
              isImosOnly={isImosOnly}
              isIntegrated={isIntegrated}
            />
          }
          items={dataSelectOptions}
          value={selectedDataItem}
        />
        <DownloadSelect
          label="Format Selection"
          items={formatOptions}
          value={selectedFormat}
        />
        <DownloadButton onDownload={onDownload} />
      </Stack>
      <DownloadSubsetting
        downloadConditions={downloadConditions}
        getAndSetDownloadConditions={getAndSetDownloadConditions}
        removeDownloadCondition={removeDownloadCondition}
        isExternal={!isImosOnly && !isIntegrated}
        isIntegrated={isIntegrated}
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

export default DownloadOriginalNetcdfsCard;

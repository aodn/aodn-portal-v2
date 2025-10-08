import React, { useCallback, useMemo } from "react";
import { Box, SxProps } from "@mui/material";
import BBoxConditionBox from "../box/BBoxConditionBox";
import DateRangeConditionBox from "../box/DateRangeConditionBox";
import {
  BBoxCondition,
  DownloadConditionType,
  DateRangeCondition,
  IDownloadCondition,
  IDownloadConditionCallback,
  type DownloadCondition,
} from "../../pages/detail-page/context/DownloadDefinitions";

interface DataSelectionComponentProps extends DownloadCondition {
  sx?: SxProps;
}

/**
 * DataSelectionComponent - Displays selected data conditions (bbox and date range)
 * Extracted from DownloadCard to be reusable across different components
 */
const DataSelection: React.FC<DataSelectionComponentProps> = ({
  sx,
  downloadConditions,
  removeDownloadCondition,
}) => {
  const bboxConditions: BBoxCondition[] = useMemo(() => {
    const bboxConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.BBOX
    );
    return bboxConditions as BBoxCondition[];
  }, [downloadConditions]);

  const dateRangeCondition: DateRangeCondition[] = useMemo(() => {
    const timeRangeConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    );
    return timeRangeConditions as DateRangeCondition[];
  }, [downloadConditions]);

  const handleRemove = useCallback(
    (condition: IDownloadConditionCallback & IDownloadCondition) => {
      condition.removeCallback && condition.removeCallback();
      removeDownloadCondition(condition);
    },
    [removeDownloadCondition]
  );

  return (
    <Box sx={{ gap: 2, ...sx }}>
      {bboxConditions.map((bboxCondition, index) => {
        return (
          <BBoxConditionBox
            key={index}
            bboxCondition={bboxCondition}
            onRemove={() => handleRemove(bboxCondition)}
          />
        );
      })}
      {dateRangeCondition.map((dateRangeCondition, index) => {
        return (
          <DateRangeConditionBox
            key={index}
            dateRangeCondition={dateRangeCondition}
            onRemove={() => handleRemove(dateRangeCondition)}
          />
        );
      })}
    </Box>
  );
};

export default DataSelection;

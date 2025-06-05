import React, { useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import BBoxConditionBox from "../box/BBoxConditionBox";
import DateRangeConditionBox from "../box/DateRangeConditionBox";
import {
  BBoxCondition,
  DownloadConditionType,
  DateRangeCondition,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../pages/detail-page/context/DownloadDefinitions";

interface DataSelectionComponentProps {
  gap?: number;
  sx?: any;
}

/**
 * DataSelectionComponent - Displays selected data conditions (bbox and date range)
 * Extracted from DownloadCard to be reusable across different components
 */
const DataSelection: React.FC<DataSelectionComponentProps> = ({
  gap = 2,
  sx,
}) => {
  const { downloadConditions, removeDownloadCondition } =
    useDetailPageContext();

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
    (c: IDownloadConditionCallback & IDownloadCondition) => {
      c.removeCallback && c.removeCallback();
      removeDownloadCondition(c);
    },
    [removeDownloadCondition]
  );

  return (
    <Box gap={gap} sx={sx}>
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

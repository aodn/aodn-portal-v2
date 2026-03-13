import { FC, useCallback, useMemo } from "react";
import { Box, SxProps } from "@mui/material";
import BBoxConditionBox from "../box/BBoxConditionBox";
import PolygonConditionBox from "../box/PolygonConditionBox";
import DateRangeConditionBox from "../box/DateRangeConditionBox";
import {
  BBoxCondition,
  PolygonCondition,
  DownloadConditionType,
  DateRangeCondition,
  IDownloadCondition,
  IDownloadConditionCallback,
  type DownloadCondition,
} from "../../pages/detail-page/context/DownloadDefinitions";

interface DataSelectionComponentProps extends DownloadCondition {
  sx?: SxProps;
  disable?: boolean;
}

/**
 * DataSelectionComponent - Displays selected data conditions (bbox and date range)
 * Extracted from DownloadCard to be reusable across different components
 */
const DataSelection: FC<DataSelectionComponentProps> = ({
  sx,
  downloadConditions,
  removeDownloadCondition,
  disable,
}) => {
  const bboxConditions: BBoxCondition[] = useMemo(() => {
    const bboxConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.BBOX
    );
    return bboxConditions as BBoxCondition[];
  }, [downloadConditions]);

  const polygonConditions: PolygonCondition[] = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.POLYGON
    ) as PolygonCondition[];
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
            disable={disable}
          />
        );
      })}
      {polygonConditions.map((polygonCondition, index) => {
        return (
          <PolygonConditionBox
            key={index}
            polygonCondition={polygonCondition}
            onRemove={() => handleRemove(polygonCondition)}
            disable={disable}
          />
        );
      })}
      {dateRangeCondition.map((dateRangeCondition, index) => {
        return (
          <DateRangeConditionBox
            key={index}
            dateRangeCondition={dateRangeCondition}
            onRemove={() => handleRemove(dateRangeCondition)}
            disable={disable}
          />
        );
      })}
    </Box>
  );
};

export default DataSelection;

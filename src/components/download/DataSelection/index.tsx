import { FC, useCallback, useMemo } from "react";
import { Stack, SxProps } from "@mui/material";
import { Dayjs } from "dayjs";
import BBoxConditionCard from "./BBoxConditionCard";
import PolygonConditionCard from "./PolygonConditionCard";
import DateRangeConditionCard from "./DateRangeConditionCard";
import {
  BBoxCondition,
  PolygonCondition,
  DownloadConditionType,
  DateRangeCondition,
  IDownloadCondition,
  IDownloadConditionCallback,
  type DownloadCondition,
} from "../../../pages/detail-page/context/DownloadDefinitions";

interface DataSelectionComponentProps extends DownloadCondition {
  sx?: SxProps;
  disable?: boolean;
  dateRangeBounds?: { min: Dayjs; max: Dayjs };
}

/**
 * DataSelectionComponent - Displays selected data conditions (bbox and date range)
 */
const DataSelection: FC<DataSelectionComponentProps> = ({
  sx,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
  disable,
  dateRangeBounds,
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

  const handleDateRangeChange = useCallback(
    (existing: DateRangeCondition, start: string, end: string) => {
      getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
        new DateRangeCondition(
          existing.id,
          start,
          end,
          existing.removeCallback
        ),
      ]);
    },
    [getAndSetDownloadConditions]
  );

  return (
    <Stack spacing={1} sx={sx}>
      {bboxConditions.map((bboxCondition) => (
        <BBoxConditionCard
          key={bboxCondition.id}
          bboxCondition={bboxCondition}
          onRemove={() => handleRemove(bboxCondition)}
          disable={disable}
        />
      ))}
      {polygonConditions.map((polygonCondition) => (
        <PolygonConditionCard
          key={polygonCondition.id}
          polygonCondition={polygonCondition}
          onRemove={() => handleRemove(polygonCondition)}
          disable={disable}
        />
      ))}
      {dateRangeCondition.map((dateRangeCondition) => (
        <DateRangeConditionCard
          key={dateRangeCondition.id}
          dateRangeCondition={dateRangeCondition}
          onRemove={() => handleRemove(dateRangeCondition)}
          onChange={(start, end) =>
            handleDateRangeChange(dateRangeCondition, start, end)
          }
          disable={disable}
          minDate={dateRangeBounds?.min}
          maxDate={dateRangeBounds?.max}
        />
      ))}
    </Stack>
  );
};

export default DataSelection;

import { FC, useCallback, useMemo } from "react";
import { Stack, SxProps } from "@mui/material";
import { Dayjs } from "dayjs";
import { BBox } from "geojson";
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
} from "../../../context/DownloadDefinitions";

interface SubsetConditionsProps extends DownloadCondition {
  sx?: SxProps;
  disable?: boolean;
  dateRangeBounds?: { min: Dayjs; max: Dayjs };
}

const SubsetConditions: FC<SubsetConditionsProps> = ({
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

  const handleAddBBox = useCallback(
    (bbox: BBox) => {
      const id = `bbox-${Date.now()}`;
      getAndSetDownloadConditions(DownloadConditionType.BBOX, [
        ...bboxConditions,
        new BBoxCondition(id, bbox),
      ]);
    },
    [bboxConditions, getAndSetDownloadConditions]
  );

  const handlePolygonUpdate = useCallback(
    (existing: PolygonCondition, coordinates: [number, number][]) => {
      const next = polygonConditions.map((c) =>
        c.id === existing.id
          ? new PolygonCondition(
              existing.id,
              coordinates,
              existing.removeCallback
            )
          : c
      );
      getAndSetDownloadConditions(DownloadConditionType.POLYGON, next);
    },
    [polygonConditions, getAndSetDownloadConditions]
  );

  const handlePolygonCreate = useCallback(
    (coordinates: [number, number][]) => {
      const id = `polygon-${Date.now()}`;
      getAndSetDownloadConditions(DownloadConditionType.POLYGON, [
        ...polygonConditions,
        new PolygonCondition(id, coordinates),
      ]);
    },
    [polygonConditions, getAndSetDownloadConditions]
  );

  return (
    <Stack spacing={1} sx={sx}>
      <BBoxConditionCard
        bboxConditions={bboxConditions}
        onRemove={handleRemove}
        onAddBBox={handleAddBBox}
        disable={disable}
      />
      {polygonConditions.length === 0 && (
        <PolygonConditionCard
          onCreate={handlePolygonCreate}
          disable={disable}
        />
      )}
      {polygonConditions.map((polygonCondition) => (
        <PolygonConditionCard
          key={polygonCondition.id}
          polygonCondition={polygonCondition}
          onRemove={() => handleRemove(polygonCondition)}
          onUpdate={(coords) => handlePolygonUpdate(polygonCondition, coords)}
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

export default SubsetConditions;

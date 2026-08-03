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
  readOnly?: boolean;
  dateRangeBounds?: { min: Dayjs; max: Dayjs };
}

const SubsetConditions: FC<SubsetConditionsProps> = ({
  sx,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
  disable,
  readOnly,
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

  const dateRangeConditions: DateRangeCondition[] = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    ) as DateRangeCondition[];
  }, [downloadConditions]);

  // Real stored conditions, or a single draft card when empty and editable.
  // Keeps one DateRangeConditionCard render path for create + update.
  const dateRangeCards = useMemo(() => {
    if (dateRangeConditions.length > 0) {
      return dateRangeConditions.map((condition) => ({
        condition,
        isDraft: false as const,
      }));
    }
    if (!readOnly) {
      return [
        {
          condition: new DateRangeCondition(
            "date-range-initial",
            dateRangeBounds?.min.format("YYYY-MM-DD") ?? "",
            dateRangeBounds?.max.format("YYYY-MM-DD") ?? ""
          ),
          isDraft: true as const,
        },
      ];
    }
    return [];
  }, [dateRangeConditions, dateRangeBounds, readOnly]);

  const handleRemove = useCallback(
    (condition: IDownloadConditionCallback & IDownloadCondition) => {
      condition.removeCallback && condition.removeCallback();
      removeDownloadCondition(condition);
    },
    [removeDownloadCondition]
  );

  const handleDateRangeChange = useCallback(
    (existing: DateRangeCondition | undefined, start: string, end: string) => {
      // Draft card: first edit creates a real condition
      if (!existing) {
        if (!start && !end) return;
        getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
          new DateRangeCondition(`date-range-${Date.now()}`, start, end),
        ]);
        return;
      }
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
      {(!readOnly || bboxConditions.length > 0) && (
        <BBoxConditionCard
          bboxConditions={bboxConditions}
          onRemove={handleRemove}
          onAddBBox={handleAddBBox}
          disable={disable}
          readOnly={readOnly}
        />
      )}
      {!readOnly && polygonConditions.length === 0 && (
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
          readOnly={readOnly}
        />
      ))}
      {dateRangeCards.map(({ condition, isDraft }) => (
        <DateRangeConditionCard
          key={condition.id}
          dateRangeCondition={condition}
          onRemove={isDraft ? undefined : () => handleRemove(condition)}
          onChange={(start, end) =>
            handleDateRangeChange(isDraft ? undefined : condition, start, end)
          }
          disable={disable}
          readOnly={readOnly}
          minDate={dateRangeBounds?.min}
          maxDate={dateRangeBounds?.max}
        />
      ))}
    </Stack>
  );
};

export default SubsetConditions;

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
  SubsettingType,
  type ConditionSupportContext,
} from "../../../context/DownloadDefinitions";
import { useDetailPageContext } from "../../../context/detail-page-context";
import { dateDefault } from "@/components/common/constants";

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
  const { isSubsettingSupported } = useDetailPageContext();

  const supportCtx: ConditionSupportContext = useMemo(
    () => ({ isSubsettingSupported }),
    [isSubsettingSupported]
  );

  const timeSupported = isSubsettingSupported(SubsettingType.TimeSlider);
  const spatialSupported = isSubsettingSupported(SubsettingType.DrawRect);

  const bboxConditions: BBoxCondition[] = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.BBOX
    ) as BBoxCondition[];
  }, [downloadConditions]);

  const polygonConditions: PolygonCondition[] = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.POLYGON
    ) as PolygonCondition[];
  }, [downloadConditions]);

  // Real stored polygons, or a single draft card when empty and editable.
  const polygonCards = useMemo(() => {
    if (!spatialSupported) return [];

    if (polygonConditions.length > 0) {
      return polygonConditions.map((condition) => ({
        condition,
        isDraft: false as const,
      }));
    }
    if (!readOnly) {
      return [{ condition: undefined, isDraft: true as const }];
    }
    return [];
  }, [polygonConditions, readOnly, spatialSupported]);

  // Real stored conditions, or a single draft card when empty and editable.
  const dateRangeCards = useMemo(() => {
    if (!timeSupported) return [];

    const dateRangeConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    ) as DateRangeCondition[];

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
            dateRangeBounds?.min.format(dateDefault.DATE_FORMAT) ?? "",
            dateRangeBounds?.max.format(dateDefault.DATE_FORMAT) ?? ""
          ),
          isDraft: true as const,
        },
      ];
    }
    return [];
  }, [
    dateRangeBounds?.max,
    dateRangeBounds?.min,
    downloadConditions,
    readOnly,
    timeSupported,
  ]);

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

  const showBBox =
    spatialSupported &&
    (!readOnly || bboxConditions.length > 0) &&
    (bboxConditions.length === 0 ||
      bboxConditions.some((c) => c.support(supportCtx)));

  return (
    <Stack spacing={1} sx={sx}>
      {showBBox && (
        <BBoxConditionCard
          bboxConditions={bboxConditions}
          onRemove={handleRemove}
          onAddBBox={handleAddBBox}
          disable={disable}
          readOnly={readOnly}
        />
      )}
      {polygonCards.map(({ condition, isDraft }) => {
        if (!isDraft && condition && !condition.support(supportCtx)) {
          return null;
        }

        return (
          <PolygonConditionCard
            key={condition?.id ?? "polygon-draft"}
            polygonCondition={condition}
            onCreate={isDraft ? handlePolygonCreate : undefined}
            onRemove={
              !isDraft && condition ? () => handleRemove(condition) : undefined
            }
            onUpdate={
              !isDraft && condition
                ? (coords) => handlePolygonUpdate(condition, coords)
                : undefined
            }
            disable={disable}
            readOnly={readOnly}
          />
        );
      })}
      {dateRangeCards.map(({ condition, isDraft }) => {
        if (!condition.support(supportCtx)) return null;

        return (
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
        );
      })}
    </Stack>
  );
};

export default SubsetConditions;

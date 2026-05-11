import React, { useCallback, useId, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { BBox } from "geojson";
import {
  BBoxCondition,
  DownloadConditionType,
} from "../../../context/DownloadDefinitions";
import BaseConditionCard from "./BaseConditionCard";
import CoordInput from "./CoordInput";
import { portalTheme } from "../../../../../styles";

interface BBoxConditionCardProps {
  bboxConditions: BBoxCondition[];
  onRemove?: (condition: BBoxCondition) => void;
  onAddBBox?: (bbox: BBox) => void;
  onDrawOnMap?: () => void;
  disable?: boolean;
}

type CoordKey = "N" | "S" | "E" | "W";
type CoordDraft = Record<CoordKey, string>;
type CoordErrors = Partial<Record<CoordKey, string>>;

const EMPTY_DRAFT: CoordDraft = { N: "", S: "", E: "", W: "" };
const SOFT_SHADOW = "1px 1px 4px 0 rgba(0, 0, 0, 0.10)";
const COORD_RANGES: Record<CoordKey, [number, number]> = {
  N: [-90, 90],
  S: [-90, 90],
  E: [-180, 180],
  W: [-180, 180],
};

interface ValidationResult {
  bbox: BBox | null;
  errors: CoordErrors;
}

const validateDraft = (draft: CoordDraft): ValidationResult => {
  const errors: CoordErrors = {};
  const values: Partial<Record<CoordKey, number>> = {};

  (Object.keys(COORD_RANGES) as CoordKey[]).forEach((key) => {
    const raw = draft[key].trim();
    if (raw === "") {
      errors[key] = "Enter a value";
      return;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      errors[key] = "Enter a number";
      return;
    }
    const [min, max] = COORD_RANGES[key];
    if (num < min || num > max) {
      errors[key] = `Must be between ${min}° and ${max}°`;
      return;
    }
    values[key] = num;
  });

  if (Object.keys(errors).length > 0) return { bbox: null, errors };

  const { N, S, E, W } = values as Record<CoordKey, number>;

  if (N <= S) {
    const msg = "North must be above South";
    errors.N = msg;
    errors.S = msg;
  }
  if (E <= W) {
    const msg = "East must be greater than West";
    errors.E = msg;
    errors.W = msg;
  }

  if (Object.keys(errors).length > 0) return { bbox: null, errors };

  return { bbox: [W, S, E, N], errors: {} };
};

// GeoJSON BBox can be 2D [W,S,E,N] or 3D [W,S,minElev,E,N,maxElev].
// Always return the four planar bounds.
const getBBoxBounds = (
  bbox: BBox
): { west: number; south: number; east: number; north: number } => {
  if (bbox.length === 6) {
    return { west: bbox[0], south: bbox[1], east: bbox[3], north: bbox[4] };
  }
  return { west: bbox[0], south: bbox[1], east: bbox[2], north: bbox[3] };
};

const round2 = (n: number) => Math.round(n * 100) / 100;

const CoordReadOnly: React.FC<{ label: CoordKey; value: number }> = ({
  label,
  value,
}) => (
  <Stack direction="row" spacing={0.5} alignItems="baseline">
    <Typography
      variant="body2Regular"
      sx={{ color: portalTheme.palette.text2, minWidth: 14 }}
    >
      {label}:
    </Typography>
    <Typography
      variant="body2Regular"
      sx={{
        color: portalTheme.palette.text2,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {round2(value)}
    </Typography>
  </Stack>
);

interface BBoxRowProps {
  index: number;
  bbox: BBox;
  onRemove?: () => void;
  disable?: boolean;
}

const BBoxRow: React.FC<BBoxRowProps> = ({
  index,
  bbox,
  onRemove,
  disable,
}) => {
  const { west, south, east, north } = getBBoxBounds(bbox);
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={4}
      sx={{
        pl: 2.5,
        pr: 1.25,
        py: 1,
        backgroundColor: "common.white",
        borderRadius: "6px",
        boxShadow: SOFT_SHADOW,
      }}
    >
      <Box
        aria-label={`bbox ${index + 1}`}
        sx={{
          width: 30,
          height: 30,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          borderRadius: "2px",
          border: `1px dashed ${portalTheme.palette.primary1}`,
          ...portalTheme.typography.body1Medium,
          color: portalTheme.palette.text1,
        }}
      >
        {index + 1}
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            columnGap: 3,
          }}
        >
          <CoordReadOnly label="N" value={north} />
          <CoordReadOnly label="W" value={west} />
          <CoordReadOnly label="S" value={south} />
          <CoordReadOnly label="E" value={east} />
        </Box>
      </Box>
      {onRemove && (
        <IconButton
          aria-label={`remove bbox ${index + 1}`}
          size="small"
          onClick={onRemove}
          disabled={disable}
        >
          <CloseIcon
            sx={{ fontSize: 16, color: portalTheme.palette.grey700 }}
          />
        </IconButton>
      )}
    </Stack>
  );
};

interface CoordInputProps {
  label: CoordKey;
  value: string;
  error?: string;
  errorMessageId?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const LabeledCoordInput: React.FC<CoordInputProps> = ({
  label,
  value,
  error,
  errorMessageId,
  onChange,
  onSubmit,
  disabled,
}) => {
  const inputId = useId();
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography
        component="label"
        htmlFor={inputId}
        variant="body2Regular"
        sx={{
          color: portalTheme.palette.text1,
          textAlign: "center",
          minWidth: 14,
          cursor: disabled ? "default" : "pointer",
        }}
      >
        {label}:
      </Typography>
      <CoordInput
        id={inputId}
        value={value}
        width={80}
        error={error}
        errorMessageId={errorMessageId}
        disabled={disabled}
        ariaLabel={`${label} coordinate`}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Stack>
  );
};

const BBoxConditionCard: React.FC<BBoxConditionCardProps> = ({
  bboxConditions,
  onRemove,
  onAddBBox,
  onDrawOnMap,
  disable,
}) => {
  const [draft, setDraft] = useState<CoordDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<CoordErrors>({});
  const errorMessageId = useId();

  const isFormDirty = useMemo(
    () => (Object.values(draft) as string[]).some((v) => v.trim() !== ""),
    [draft]
  );

  const setField = useCallback(
    (label: CoordKey) => (value: string) => {
      setDraft((prev) => ({ ...prev, [label]: value }));
      setErrors((prev) => {
        if (!prev[label]) return prev;
        const next = { ...prev };
        delete next[label];
        return next;
      });
    },
    []
  );

  const submitDraft = useCallback(() => {
    const result = validateDraft(draft);
    if (result.bbox && onAddBBox) {
      onAddBBox(result.bbox);
      setDraft(EMPTY_DRAFT);
      setErrors({});
      return;
    }
    setErrors(result.errors);
  }, [draft, onAddBBox]);

  const handleActionClick = useCallback(() => {
    if (isFormDirty) {
      submitDraft();
      return;
    }
    onDrawOnMap?.();
  }, [isFormDirty, submitDraft, onDrawOnMap]);

  const errorMessage = useMemo(() => {
    const messages = Array.from(new Set(Object.values(errors)));
    if (messages.length === 0) return null;
    if (messages.length === 1) return messages[0];
    return `Check ${(Object.keys(errors) as CoordKey[]).join(", ")}`;
  }, [errors]);

  const actionLabel = isFormDirty
    ? "Add bounding box"
    : "Draw bounding box on map";

  const actionDisabled = disable || (isFormDirty ? !onAddBBox : !onDrawOnMap);

  const showDivider = bboxConditions.length > 0;

  return (
    <BaseConditionCard
      type={DownloadConditionType.BBOX}
      disable={disable}
      contentSx={{ px: 0 }}
      actions={
        <Button
          fullWidth
          startIcon={
            <Box
              sx={{
                width: 28,
                height: 28,
                display: "grid",
                placeItems: "center",
                borderRadius: "2px",
                border: `1px dashed ${portalTheme.palette.primary1}`,
              }}
            >
              <AddIcon
                sx={{ fontSize: 18, color: portalTheme.palette.grey700 }}
              />
            </Box>
          }
          onClick={handleActionClick}
          disabled={actionDisabled}
          sx={{
            justifyContent: "center",
            textTransform: "none",
            ...portalTheme.typography.body2Regular,
            color: portalTheme.palette.text1,
            "& .MuiButton-startIcon": { ml: 0, mr: 1.5 },
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          {actionLabel}
        </Button>
      }
    >
      <Stack data-testid="bbox-condition-box">
        <Stack spacing={1.5} sx={{ px: 1.5 }}>
          {bboxConditions.map((condition, idx) => (
            <BBoxRow
              key={condition.id}
              index={idx}
              bbox={condition.bbox}
              onRemove={onRemove ? () => onRemove(condition) : undefined}
              disable={disable}
            />
          ))}
        </Stack>

        {showDivider && (
          <Divider
            sx={{ borderBottomWidth: 2, borderColor: "common.white", my: 1 }}
          />
        )}

        <Stack
          spacing={1.5}
          alignItems="center"
          sx={{ pt: 0.5, px: 1.5, width: "fit-content", mx: "auto" }}
        >
          <LabeledCoordInput
            label="N"
            value={draft.N}
            error={errors.N}
            errorMessageId={errorMessageId}
            onChange={setField("N")}
            onSubmit={submitDraft}
            disabled={disable}
          />
          <Stack direction="row" spacing={3}>
            <LabeledCoordInput
              label="W"
              value={draft.W}
              error={errors.W}
              errorMessageId={errorMessageId}
              onChange={setField("W")}
              onSubmit={submitDraft}
              disabled={disable}
            />
            <LabeledCoordInput
              label="E"
              value={draft.E}
              error={errors.E}
              errorMessageId={errorMessageId}
              onChange={setField("E")}
              onSubmit={submitDraft}
              disabled={disable}
            />
          </Stack>
          <LabeledCoordInput
            label="S"
            value={draft.S}
            error={errors.S}
            errorMessageId={errorMessageId}
            onChange={setField("S")}
            onSubmit={submitDraft}
            disabled={disable}
          />
          {errorMessage && (
            <Typography
              id={errorMessageId}
              role="alert"
              variant="body2Regular"
              sx={{
                color: portalTheme.palette.error.main,
                pt: 0.5,
              }}
            >
              {errorMessage}
            </Typography>
          )}
        </Stack>
      </Stack>
    </BaseConditionCard>
  );
};

export default BBoxConditionCard;

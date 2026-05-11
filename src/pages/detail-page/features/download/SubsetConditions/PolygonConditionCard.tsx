import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PolygonCondition,
  DownloadConditionType,
} from "../../../context/DownloadDefinitions";
import BaseConditionCard from "./BaseConditionCard";
import CoordInput from "./CoordInput";
import { Box, ButtonBase, IconButton, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/Add";
import { portalTheme } from "../../../../../styles";
import { PolygonSelectionTooltipIcon } from "../../../../../assets/icons/map/tooltip_polygon_selection";

const MIN_VERTICES = 3;
const COL_WIDTH = 70;
const CONTENT_MAX_WIDTH = 200;
const MIDDLE_GAP = 12;
const BULLET_SIZE = 5;
const BULLET_COLUMN_WIDTH = 12;

// TODO: promote to portalTheme palette once design tokens are extended.
const BULLET_COLOR = "#7FA2B7";
const COORD_TEXT_COLOR = "#5B5B5B";

const RANGE_HINT = "Latitude must be -90 to 90, longitude -180 to 180.";

const isValidLat = (n: number) => Number.isFinite(n) && n >= -90 && n <= 90;
const isValidLng = (n: number) => Number.isFinite(n) && n >= -180 && n <= 180;

const RESET_TYPO_SX = { m: 0, p: 0 } as const;

const COORD_TEXT_SX = {
  ...portalTheme.typography.body2Regular,
  ...RESET_TYPO_SX,
  lineHeight: "11px",
  color: COORD_TEXT_COLOR,
  fontVariantNumeric: "tabular-nums",
  width: COL_WIDTH,
} as const;

const CLOSING_TEXT_SX = {
  ...portalTheme.typography.body2Regular,
  ...RESET_TYPO_SX,
  color: portalTheme.palette.grey600,
  fontStyle: "italic",
  fontVariantNumeric: "tabular-nums",
  width: COL_WIDTH,
} as const;

const BulletDot: React.FC<{ dashed?: boolean }> = ({ dashed }) => (
  <Box
    sx={{
      width: BULLET_COLUMN_WIDTH,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      component="span"
      sx={{
        width: `${BULLET_SIZE}px`,
        height: `${BULLET_SIZE}px`,
        borderRadius: "50%",
        ...(dashed
          ? { border: `1px dashed ${portalTheme.palette.grey600}` }
          : { backgroundColor: BULLET_COLOR }),
      }}
    />
  </Box>
);

interface VertexRowProps {
  lat: number;
  lng: number;
  index: number;
  disabled: boolean;
  onActivate: (index: number) => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const VertexRow: React.FC<VertexRowProps> = memo(
  ({
    lat,
    lng,
    index,
    disabled,
    onActivate,
    onEdit,
    onRemove,
  }: VertexRowProps) => {
    const handleActivate = useCallback(
      () => onActivate(index),
      [index, onActivate]
    );
    const handleEdit = useCallback(() => onEdit(index), [index, onEdit]);
    const handleRemove = useCallback(() => onRemove(index), [index, onRemove]);

    return (
      <Box
        sx={{
          width: "100%",
          "& .row-actions": { display: "none" },
          ...(disabled
            ? {}
            : {
                "&:hover, &:focus-within": {
                  "& .row-bg": {
                    backgroundColor: portalTheme.palette.primary5,
                  },
                  "& .row-actions": { display: "flex" },
                },
              }),
        }}
      >
        <ButtonBase
          className="row-bg"
          onClick={handleActivate}
          disabled={disabled}
          aria-label={`Edit vertex ${index + 1}`}
          sx={{
            display: "block",
            width: "100%",
            py: 0.5,
            borderRadius: "4px",
            cursor: disabled ? "default" : "pointer",
            "&.Mui-focusVisible": {
              outline: `2px solid ${portalTheme.palette.primary1}`,
              outlineOffset: "-2px",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: "auto" }}
          >
            <BulletDot />
            <Typography sx={{ ...COORD_TEXT_SX, textAlign: "right" }}>
              {lat.toFixed(4)}
            </Typography>
            <Box sx={{ width: MIDDLE_GAP }} />
            <Typography sx={{ ...COORD_TEXT_SX, textAlign: "left" }}>
              {lng.toFixed(4)}
            </Typography>
          </Stack>
        </ButtonBase>

        <Stack
          className="row-actions"
          direction="row"
          justifyContent="center"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <IconButton
            size="small"
            onClick={handleEdit}
            aria-label="edit vertex"
          >
            <EditOutlinedIcon
              sx={{ color: portalTheme.palette.grey700, fontSize: 16 }}
            />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleRemove}
            aria-label="remove vertex"
          >
            <DeleteOutlineIcon
              sx={{ color: portalTheme.palette.grey700, fontSize: 16 }}
            />
          </IconButton>
        </Stack>
      </Box>
    );
  }
);
VertexRow.displayName = "VertexRow";

interface EditVertexRowProps {
  lat: string;
  lng: string;
  inputRef: React.Ref<HTMLInputElement>;
  onLatChange: (v: string) => void;
  onLngChange: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}

const EditVertexRow: React.FC<EditVertexRowProps> = ({
  lat,
  lng,
  inputRef,
  onLatChange,
  onLngChange,
  onCommit,
  onCancel,
}) => (
  <Box sx={{ py: 0.5 }}>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: "auto" }}
    >
      <Box sx={{ width: BULLET_COLUMN_WIDTH }} />
      <CoordInput
        value={lat}
        align="right"
        selectOnFocus
        ariaLabel="Latitude"
        onChange={onLatChange}
        onSubmit={onCommit}
        onCancel={onCancel}
        ref={inputRef}
      />
      <Box sx={{ width: MIDDLE_GAP }} />
      <CoordInput
        value={lng}
        align="right"
        selectOnFocus
        ariaLabel="Longitude"
        onChange={onLngChange}
        onSubmit={onCommit}
        onCancel={onCancel}
      />
    </Stack>
    <Stack
      direction="row"
      justifyContent="center"
      spacing={0.5}
      sx={{ mt: 0.5 }}
    >
      <IconButton size="small" onClick={onCommit} aria-label="save vertex">
        <CheckIcon
          fontSize="small"
          sx={{ color: portalTheme.palette.primary1 }}
        />
      </IconButton>
      <IconButton size="small" onClick={onCancel} aria-label="cancel edit">
        <CloseRoundedIcon
          fontSize="small"
          sx={{ color: portalTheme.palette.grey700 }}
        />
      </IconButton>
    </Stack>
  </Box>
);

interface ClosingRowProps {
  lat: number;
  lng: number;
}

const ClosingRow: React.FC<ClosingRowProps> = ({ lat, lng }) => (
  <Box sx={{ py: 0.5 }}>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: "auto" }}
    >
      <BulletDot dashed />
      <Typography sx={{ ...CLOSING_TEXT_SX, textAlign: "right" }}>
        {lat.toFixed(4)}
      </Typography>
      <Box sx={{ width: MIDDLE_GAP }} />
      <Typography sx={{ ...CLOSING_TEXT_SX, textAlign: "left" }}>
        {lng.toFixed(4)}
      </Typography>
    </Stack>
  </Box>
);

interface AddVertexRowProps {
  lat: string;
  lng: string;
  disabled?: boolean;
  onLatChange: (v: string) => void;
  onLngChange: (v: string) => void;
  onAdd: () => void;
}

const AddVertexRow: React.FC<AddVertexRowProps> = ({
  lat,
  lng,
  disabled,
  onLatChange,
  onLngChange,
  onAdd,
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"
    spacing={1.5}
    sx={{ mt: 1.5 }}
  >
    <Typography
      sx={{
        ...portalTheme.typography.body2Regular,
        ...RESET_TYPO_SX,
        fontVariantNumeric: "tabular-nums",
        color: portalTheme.palette.text1,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      Lat/Long:
    </Typography>
    <CoordInput
      value={lat}
      align="right"
      selectOnFocus
      ariaLabel="Latitude"
      onChange={onLatChange}
      onSubmit={onAdd}
    />
    <Typography sx={{ color: portalTheme.palette.text2, ...RESET_TYPO_SX }}>
      /
    </Typography>
    <CoordInput
      value={lng}
      align="right"
      selectOnFocus
      ariaLabel="Longitude"
      onChange={onLngChange}
      onSubmit={onAdd}
    />
    <IconButton
      size="small"
      onClick={onAdd}
      disabled={disabled}
      aria-label="add vertex"
      sx={{ p: 0.25 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: "30px",
          border: `1.75px dashed ${portalTheme.palette.primary1}`,
        }}
      >
        <AddIcon sx={{ fontSize: 18, color: portalTheme.palette.grey700 }} />
      </Box>
    </IconButton>
  </Stack>
);

interface PolygonConditionCardProps {
  polygonCondition?: PolygonCondition;
  onRemove?: () => void;
  onUpdate?: (coordinates: [number, number][]) => void;
  onCreate?: (coordinates: [number, number][]) => void;
  disable?: boolean;
  readOnly?: boolean;
}

const PolygonConditionCard: React.FC<PolygonConditionCardProps> = ({
  onRemove,
  polygonCondition,
  onUpdate,
  onCreate,
  disable = false,
  readOnly = false,
}) => {
  const [pendingVertices, setPendingVertices] = useState<[number, number][]>(
    []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");
  const [addLat, setAddLat] = useState("");
  const [addLng, setAddLng] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const editLatRef = useRef<HTMLInputElement>(null);

  const hasPolygon = !!polygonCondition;
  const vertices: [number, number][] =
    polygonCondition?.coordinates ?? pendingVertices;
  const canDelete = hasPolygon
    ? vertices.length > MIN_VERTICES
    : vertices.length > 0;

  // Clear local draft when a polygon condition arrives (e.g. user drew on map).
  // Use the stable id so we don't re-run for re-rendered identical conditions.
  const polygonId = polygonCondition?.id;
  useEffect(() => {
    if (polygonId) setPendingVertices([]);
  }, [polygonId]);

  // Reset editing state if the underlying vertex disappears (e.g. polygon
  // replaced externally), which would otherwise leave editingIndex dangling.
  useEffect(() => {
    if (editingIndex !== null && editingIndex >= vertices.length) {
      setEditingIndex(null);
      setEditLat("");
      setEditLng("");
    }
  }, [editingIndex, vertices.length]);

  // Auto-focus + select the lat input when entering edit mode.
  useEffect(() => {
    if (editingIndex !== null) {
      editLatRef.current?.focus();
      editLatRef.current?.select();
    }
  }, [editingIndex]);

  const editLatNum = parseFloat(editLat);
  const editLngNum = parseFloat(editLng);
  const editValid = isValidLat(editLatNum) && isValidLng(editLngNum);

  const addLatNum = parseFloat(addLat);
  const addLngNum = parseFloat(addLng);
  const addValid =
    addLat !== "" &&
    addLng !== "" &&
    isValidLat(addLatNum) &&
    isValidLng(addLngNum);

  const setVertices = useCallback(
    (next: [number, number][]) => {
      if (hasPolygon) {
        onUpdate?.(next);
        return;
      }
      if (next.length >= MIN_VERTICES) {
        onCreate?.(next);
        setPendingVertices([]);
        return;
      }
      setPendingVertices(next);
    },
    [hasPolygon, onUpdate, onCreate]
  );

  const startEdit = useCallback(
    (index: number) => {
      if (disable) return;
      const target = vertices[index];
      if (!target) return;
      const [lng, lat] = target;
      setEditingIndex(index);
      setEditLat(lat.toFixed(4));
      setEditLng(lng.toFixed(4));
      setStatusMessage(null);
    },
    [disable, vertices]
  );

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditLat("");
    setEditLng("");
    setStatusMessage(null);
  }, []);

  const commitEdit = useCallback(() => {
    if (editingIndex === null) return;
    if (!editValid) {
      setStatusMessage(RANGE_HINT);
      return;
    }
    const next = vertices.map((v, i) =>
      i === editingIndex ? ([editLngNum, editLatNum] as [number, number]) : v
    );
    setVertices(next);
    setStatusMessage(null);
    cancelEdit();
  }, [
    editingIndex,
    editValid,
    editLatNum,
    editLngNum,
    vertices,
    setVertices,
    cancelEdit,
  ]);

  const removeVertex = useCallback(
    (index: number) => {
      if (!canDelete) {
        setStatusMessage(`A polygon needs at least ${MIN_VERTICES} vertices.`);
        return;
      }
      setVertices(vertices.filter((_, i) => i !== index));
      setStatusMessage(null);
    },
    [canDelete, setVertices, vertices]
  );

  const addVertex = useCallback(() => {
    if (!addValid) {
      setStatusMessage(RANGE_HINT);
      return;
    }
    setVertices([...vertices, [addLngNum, addLatNum] as [number, number]]);
    setAddLat("");
    setAddLng("");
    setStatusMessage(null);
  }, [addValid, addLatNum, addLngNum, setVertices, vertices]);

  const firstVertex = vertices[0];

  const drawAction = useMemo(
    () => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ display: "flex", "& svg": { width: 32, height: 32 } }}>
          <PolygonSelectionTooltipIcon />
        </Box>
        <Typography
          variant="body1Medium"
          sx={{ color: portalTheme.palette.text1 }}
        >
          Draw polygon on map
        </Typography>
      </Stack>
    ),
    []
  );

  return (
    <BaseConditionCard
      type={DownloadConditionType.POLYGON}
      removeCallback={onRemove}
      disable={disable}
      actions={readOnly ? undefined : drawAction}
      headerDivider
      contentSx={{ pt: 1.5 }}
    >
      <Box data-testid="polygon-condition-box">
        <Stack spacing={1} alignItems="center">
          {vertices.map(([lng, lat], index) =>
            !readOnly && editingIndex === index ? (
              <EditVertexRow
                key={index}
                lat={editLat}
                lng={editLng}
                inputRef={editLatRef}
                onLatChange={setEditLat}
                onLngChange={setEditLng}
                onCommit={commitEdit}
                onCancel={cancelEdit}
              />
            ) : (
              <VertexRow
                key={index}
                lat={lat}
                lng={lng}
                index={index}
                disabled={disable || readOnly}
                onActivate={startEdit}
                onEdit={startEdit}
                onRemove={removeVertex}
              />
            )
          )}

          {firstVertex && (
            <ClosingRow lat={firstVertex[1]} lng={firstVertex[0]} />
          )}
        </Stack>

        {statusMessage && (
          <Typography
            role="alert"
            variant="body2Regular"
            sx={{
              mt: 1,
              display: "block",
              width: "100%",
              textAlign: "center",
              color: portalTheme.palette.error.main,
            }}
          >
            {statusMessage}
          </Typography>
        )}

        {!readOnly && (
          <AddVertexRow
            lat={addLat}
            lng={addLng}
            disabled={disable}
            onLatChange={setAddLat}
            onLngChange={setAddLng}
            onAdd={addVertex}
          />
        )}
      </Box>
    </BaseConditionCard>
  );
};

export default PolygonConditionCard;

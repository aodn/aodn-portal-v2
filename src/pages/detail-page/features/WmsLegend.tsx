import { FC, useState } from "react";
import {
  Box,
  ButtonBase,
  Collapse,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { formatToUrl } from "../../../utils/UrlUtils";
import { MapTileRequest } from "@/app/api/geoserverTypes";

interface WmsLegendProps {
  uuid: string;
  layerName: string;
}

// TODO: short-term solution — replace with the final design once it is scheduled
const HORIZONTAL_PADDING = "8px";
const COLLAPSED_BAR_HEIGHT = "38px";
const EXPANDED_MAX_HEIGHT = "320px";
const COLLAPSE_BUTTON_RIGHT = "3px";

const legendImageUrl = (uuid: string, layerName: string) =>
  formatToUrl<Pick<MapTileRequest, "layerName">>({
    baseUrl: `/api/v1/ogc/collections/${uuid}/items/wms_legend`,
    params: { layerName },
  });

const CollapsedLegendBar: FC<{ onExpand: () => void }> = ({ onExpand }) => {
  const theme = useTheme();

  return (
    <ButtonBase
      aria-expanded={false}
      onClick={onExpand}
      sx={{
        width: "100%",
        justifyContent: "space-between",
        height: COLLAPSED_BAR_HEIGHT,
        px: HORIZONTAL_PADDING,
      }}
    >
      <Typography variant="body1Medium" color={theme.palette.text1}>
        Legend
      </Typography>
      <ExpandMore sx={{ color: theme.palette.action.active }} />
    </ButtonBase>
  );
};

const ExpandedLegendPanel: FC<
  WmsLegendProps & {
    imageFailed: boolean;
    onImageError: () => void;
    onCollapse: () => void;
  }
> = ({ uuid, layerName, imageFailed, onImageError, onCollapse }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        size="small"
        aria-expanded
        aria-label="Collapse legend"
        onClick={onCollapse}
        sx={{
          position: "absolute",
          top: `calc(${COLLAPSED_BAR_HEIGHT} / 2)`,
          right: COLLAPSE_BUTTON_RIGHT,
          transform: "translateY(-50%)",
          zIndex: 1,
          color: theme.palette.action.active,
        }}
      >
        <ExpandMore sx={{ transform: "rotate(180deg)" }} />
      </IconButton>

      {imageFailed ? (
        <Typography
          variant="body1Medium"
          color={theme.palette.text1}
          sx={{
            display: "flex",
            alignItems: "center",
            height: COLLAPSED_BAR_HEIGHT,
            px: HORIZONTAL_PADDING,
          }}
        >
          No legend available for this layer
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: EXPANDED_MAX_HEIGHT,
            overflow: "auto",
            py: "8px",
            px: HORIZONTAL_PADDING,
          }}
        >
          <img
            src={legendImageUrl(uuid, layerName)}
            alt={`Color key and symbols for the ${layerName} map layer`}
            onError={onImageError}
            style={{ display: "block", maxWidth: "100%" }}
          />
        </Box>
      )}
    </Box>
  );
};

const LegendPanel: FC<WmsLegendProps> = ({ uuid, layerName }) => {
  const [expanded, setExpanded] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Box>
      {!expanded && <CollapsedLegendBar onExpand={() => setExpanded(true)} />}
      <Collapse in={expanded}>
        <ExpandedLegendPanel
          uuid={uuid}
          layerName={layerName}
          imageFailed={imageFailed}
          onImageError={() => setImageFailed(true)}
          onCollapse={() => setExpanded(false)}
        />
      </Collapse>
    </Box>
  );
};

const WmsLegend: FC<WmsLegendProps> = ({ uuid, layerName }) =>
  uuid && layerName ? (
    <LegendPanel
      key={`${uuid}:${layerName}`}
      uuid={uuid}
      layerName={layerName}
    />
  ) : null;

export default WmsLegend;

import { FC, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { formatToUrl } from "../../../utils/UrlUtils";
import { MapTileRequest } from "../../../components/common/store/GeoserverDefinitions";

interface WmsLegendProps {
  uuid: string;
  layerName: string;
}

const legendImageUrl = (uuid: string, layerName: string) =>
  formatToUrl<Pick<MapTileRequest, "layerName">>({
    baseUrl: `/api/v1/ogc/collections/${uuid}/items/wms_legend`,
    params: { layerName },
  });

// A button that reveals the GeoServer legend image (icons + labels as drawn on
// the map), or a short message if the layer has none.
const LegendPanel: FC<WmsLegendProps> = ({ uuid, layerName }) => {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <Box>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        sx={{ textTransform: "none", minWidth: "auto" }}
      >
        {open ? "Hide legend" : "Show legend"}
      </Button>

      {open && failed && (
        <Typography variant="body3Small">
          No legend available for this layer
        </Typography>
      )}

      {open && !failed && (
        <Box sx={{ maxHeight: "320px", overflow: "auto", m: 1 }}>
          <img
            src={legendImageUrl(uuid, layerName)}
            alt={`Colour key and symbols for the ${layerName} map layer`}
            onError={() => setFailed(true)}
            style={{ display: "block", maxWidth: "100%" }}
          />
        </Box>
      )}
    </Box>
  );
};

// Renders nothing without a layer. Keyed on (uuid, layerName) so the open/failed
// state resets when the layer changes.
const WmsLegend: FC<WmsLegendProps> = ({ uuid, layerName }) =>
  uuid && layerName ? (
    <LegendPanel
      key={`${uuid}:${layerName}`}
      uuid={uuid}
      layerName={layerName}
    />
  ) : null;

export default WmsLegend;

import { FC, useState } from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { GriddedValueRange } from "@/app/store/GriddedTileDefinitions";

interface GriddedRasterLegendProps {
  // Bare colour-bar image, e.g. "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=viridis"
  legendUrl?: string;
  // Colour range the tiles were rendered with; labelled under the bar.
  range?: GriddedValueRange;
  // Categorical: one label per colour block, in order. Takes precedence.
  labels?: string[];
  // Shown to the right of the bar, e.g. "GSLA".
  variable?: string;
  layerName?: string;
}

const BAR_HEIGHT = "12px";
// Keeps the centred end labels inside the bar's column.
const BAR_INSET = "16px";
// Evenly spaced ticks along the bar, as a fraction of its width.
const TICK_POSITIONS = [0, 0.25, 0.5, 0.75, 1];

/** At most one decimal place, without a trailing ".0" (268, 278.5). */
export const formatLegendValue = (value: number): string =>
  String(Number(value.toFixed(1)) || 0);

interface BarLabel {
  // Fraction of the bar's width the label is centred on.
  position: number;
  text: string;
}

const rangeLabels = ([min, max]: GriddedValueRange): BarLabel[] =>
  TICK_POSITIONS.map((position) => ({
    position,
    text: formatLegendValue(min + (max - min) * position),
  }));

// The bar draws one equal-width block per category; label each block's centre.
const categoryLabels = (labels: string[]): BarLabel[] =>
  labels.map((text, i) => ({ position: (i + 0.5) / labels.length, text }));

const BarLabels: FC<{ labels: BarLabel[] }> = ({ labels }) => {
  const theme = useTheme();

  return (
    <Box
      data-testid="gridded-legend-range"
      sx={{ position: "relative", height: "20px", mt: "4px" }}
    >
      {labels.map(({ position, text }) => (
        <Typography
          key={position}
          variant="body2Regular"
          color={theme.palette.text1}
          sx={{
            position: "absolute",
            left: `${position * 100}%`,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </Typography>
      ))}
    </Box>
  );
};

const LegendBody: FC<GriddedRasterLegendProps & { legendUrl: string }> = ({
  legendUrl,
  range,
  labels,
  variable,
  layerName,
}) => {
  const theme = useTheme();
  const barLabels = labels?.length
    ? categoryLabels(labels)
    : range && rangeLabels(range);
  // Tied to the url: a different colormap is a new image that may well load.
  const [failedUrl, setFailedUrl] = useState<string | undefined>(undefined);
  const imageFailed = failedUrl === legendUrl;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        px: "16px",
        py: "8px",
      }}
    >
      <Typography
        variant="body2Regular"
        color={theme.palette.text1}
        sx={{ flexShrink: 0 }}
      >
        Legends
      </Typography>
      <Divider orientation="vertical" flexItem />

      {imageFailed ? (
        <Typography
          variant="body2Regular"
          color={theme.palette.text1}
          sx={{ flex: 1 }}
        >
          No legend available for this layer
        </Typography>
      ) : (
        <>
          <Box sx={{ flex: 1, minWidth: 0, px: BAR_INSET }}>
            <img
              src={legendUrl}
              alt={
                layerName
                  ? `Color scale for the ${layerName} map layer`
                  : "Color scale for the gridded map layer"
              }
              onError={() => setFailedUrl(legendUrl)}
              style={{ display: "block", width: "100%", height: BAR_HEIGHT }}
            />
            {barLabels && <BarLabels labels={barLabels} />}
          </Box>
          {variable && (
            <Typography
              variant="body2Regular"
              color={theme.palette.text1}
              noWrap
              title={variable}
              sx={{ flexShrink: 1, maxWidth: "30%" }}
            >
              {variable}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

const GriddedRasterLegend: FC<GriddedRasterLegendProps> = ({
  legendUrl,
  ...props
}) => (legendUrl ? <LegendBody legendUrl={legendUrl} {...props} /> : null);

export default GriddedRasterLegend;

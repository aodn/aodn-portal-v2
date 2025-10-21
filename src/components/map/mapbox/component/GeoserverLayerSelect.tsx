import { FC, useMemo } from "react";
import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import { borderRadius, zIndex } from "../../../../styles/constants";
import CommonSelect, {
  SelectItem,
} from "../../../common/dropdown/CommonSelect";
import rc8Theme from "../../../../styles/themeRC8";

interface GeoserverLayerSelectProps {
  wmsLayersOptions: SelectItem<string>[];
  selectedWMSLayer: string;
  handleSelectWMSLayer: (value: string) => void;
  isLoading: boolean;
}

const GeoserverLayerSelect: FC<GeoserverLayerSelectProps> = ({
  wmsLayersOptions,
  selectedWMSLayer,
  handleSelectWMSLayer,
  isLoading,
}) => {
  const theme = useTheme();

  const selectProps = useMemo(
    () => ({
      backgroundColor: "#fff",
      border: "none",
      boxShadow: theme.shadows[5],
    }),
    [theme]
  );

  const menuProps = useMemo(
    () => ({
      PaperProps: {
        sx: {
          backgroundColor: "#fff",
          border: "none",
          boxShadow: theme.shadows[5],
          mt: "6px",
          "& .MuiMenuItem-root": {
            ...rc8Theme.typography.body1Medium,
            "&.Mui-selected": {
              backgroundColor: rc8Theme.palette.primary5,
            },
          },
        },
      },
    }),
    [theme]
  );

  return (
    <Box
      id="geoserver-layer-select-container"
      sx={{
        width: "auto",
        position: "absolute",
        bottom: 0,
        zIndex: zIndex.MAP_POPUP,
        padding: "8px",
      }}
    >
      {isLoading ? (
        <>
          <Typography py={2}>Fetching Geoserver Layers...</Typography>
          <LinearProgress
            variant="indeterminate"
            sx={{
              height: 8,
              borderRadius: borderRadius.small,
              backgroundColor: rc8Theme.palette.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: rc8Theme.palette.primary.main,
              },
            }}
          />
        </>
      ) : wmsLayersOptions.length > 0 ? (
        <CommonSelect
          items={wmsLayersOptions}
          label="Map Layers"
          value={selectedWMSLayer}
          onSelectCallback={handleSelectWMSLayer}
          menuProps={menuProps}
          selectSx={selectProps}
        />
      ) : null}
    </Box>
  );
};

export default GeoserverLayerSelect;

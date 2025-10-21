import { FC, useMemo } from "react";
import {
  Box,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
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

  const selectProps = {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "unset",
  };

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
        maxWidth: "100%",
        position: "absolute",
        top: 0,
        left: "40px",
        zIndex: zIndex.MAP_POPUP,
        padding: "10px",
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
        <Stack
          direction="row"
          sx={{
            backgroundColor: "#fff",
            border: "none",
            borderRadius: borderRadius.small,
            boxShadow: theme.shadows[5],
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              ...rc8Theme.typography.body1Medium,
              pt: 0,
              px: "12px",
              whiteSpace: "nowrap",
            }}
          >
            Dataset Selection
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              bgcolor: rc8Theme.palette.grey600,
              my: "6px",
            }}
          />
          <CommonSelect
            items={wmsLayersOptions}
            value={selectedWMSLayer}
            onSelectCallback={handleSelectWMSLayer}
            menuProps={menuProps}
            selectSx={selectProps}
          />
        </Stack>
      ) : null}
    </Box>
  );
};

export default GeoserverLayerSelect;

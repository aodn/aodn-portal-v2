import { FC, ReactNode, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { borderRadius } from "@/styles/constants";
import CommonSelect, {
  SelectItem,
} from "../../../common/dropdown/CommonSelect";
import { portalTheme } from "../../../../styles";
import useBreakpoint from "../../../../hooks/useBreakpoint";

/** Host slot above the map. Layers still own options; this is only placement. */
export const MAP_DATASET_SELECT_SLOT_ID = "map-dataset-select-slot";

interface MapLayerSelectProps {
  layersOptions: SelectItem<string>[];
  selectedLayer: string;
  handleSelectLayer: (value: string) => void;
  isLoading: boolean;
  loadingText?: string;
}

const selectProps = {
  backgroundColor: "transparent",
  border: "none",
  boxShadow: "unset",
  textAlign: "left",
  "& .MuiSelect-select": {
    textAlign: "left",
    justifyContent: "flex-start",
  },
};

const MapLayerSelect: FC<MapLayerSelectProps> = ({
  layersOptions,
  selectedLayer,
  handleSelectLayer,
  isLoading,
  loadingText = "Loading Layers...",
}) => {
  const theme = useTheme();
  const { isLargeMobile } = useBreakpoint();

  const menuProps = useMemo(
    () => ({
      PaperProps: {
        sx: {
          backgroundColor: "#fff",
          border: "none",
          boxShadow: theme.shadows[5],
          mt: "6px",
          maxWidth: "80vw",
          "& .MuiMenuItem-root": {
            ...portalTheme.typography.body1Medium,
            textAlign: "left",
            justifyContent: "flex-start",
            whiteSpace: "normal",
            wordBreak: "break-word",
            "&.Mui-selected": {
              backgroundColor: portalTheme.palette.primary5,
            },
          },
        },
      },
    }),
    [theme]
  );

  if (!isLoading && layersOptions.length === 0) {
    return null;
  }

  const content: ReactNode = (
    <Box
      id="geoserver-layer-select-container"
      sx={{
        width: "100%",
      }}
    >
      {isLoading ? (
        <Stack
          direction="column"
          sx={{
            backgroundColor: "#fff",
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
            alignContent: "center",
            alignItems: "center",
            p: "12px",
          }}
          gap={1}
          data-testid="layer-select-loading"
        >
          <Typography
            sx={{
              ...portalTheme.typography.body1Medium,
              p: 0,
              px: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {loadingText}
          </Typography>
          <LinearProgress
            variant="indeterminate"
            sx={{
              height: 8,
              width: "100%",
              borderRadius: borderRadius.small,
              backgroundColor: portalTheme.palette.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: portalTheme.palette.primary.main,
              },
            }}
          />
        </Stack>
      ) : (
        <Stack
          direction="row"
          sx={{
            backgroundColor: "#fff",
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {!isLargeMobile && (
            <>
              <Typography
                sx={{
                  ...portalTheme.typography.body1Medium,
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
                  bgcolor: portalTheme.palette.grey600,
                  my: "6px",
                }}
              />
            </>
          )}
          <CommonSelect
            items={layersOptions}
            value={selectedLayer}
            onSelectCallback={handleSelectLayer}
            menuProps={menuProps}
            selectSx={selectProps}
            dataTestId="layer-select-dropdown"
          />
        </Stack>
      )}
    </Box>
  );

  const slot = document.getElementById(MAP_DATASET_SELECT_SLOT_ID);
  return slot ? createPortal(content, slot) : content;
};

export default MapLayerSelect;

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
import { portalTheme } from "../../../../styles";
import useBreakpoint from "../../../../hooks/useBreakpoint";

interface HexbinLayerSelectProps {
  hexbinOptions: SelectItem<string>[];
  selectedHexbin: string;
  handleSelectHexbin: (value: string) => void;
  isLoading: boolean;
}

const HexbinLayerSelect: FC<HexbinLayerSelectProps> = ({
  hexbinOptions,
  selectedHexbin,
  handleSelectHexbin,
  isLoading,
}) => {
  const theme = useTheme();
  const { isUnderLaptop } = useBreakpoint();

  // Style props for the select component
  const selectProps = {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "unset",
  };

  // Menu dropdown styling configuration
  const menuProps = useMemo(
    () => ({
      PaperProps: {
        sx: {
          backgroundColor: "#fff",
          border: "none",
          boxShadow: theme.shadows[5],
          mt: "6px",
          "& .MuiMenuItem-root": {
            ...portalTheme.typography.body1Medium,
            "&.Mui-selected": {
              backgroundColor: portalTheme.palette.primary5,
            },
          },
        },
      },
    }),
    [theme]
  );

  return (
    <Box
      id="hexbin-layer-select-container"
      sx={{
        width: "auto",
        maxWidth: "70%",
        position: "absolute",
        top: 0,
        left: `${isUnderLaptop ? "0px" : "40px"}`,
        zIndex: zIndex.MAP_BASE,
        padding: "10px",
      }}
    >
      {/* Loading state: show progress bar */}
      {isLoading ? (
        <Stack
          direction="column"
          sx={{
            backgroundColor: "#fff",
            border: "none",
            borderRadius: borderRadius.small,
            boxShadow: theme.shadows[5],
            alignContent: "center",
            alignItems: "center",
            p: "12px",
          }}
          gap={1}
        >
          <Typography
            sx={{
              ...portalTheme.typography.body1Medium,
              p: 0,
              px: "12px",
              whiteSpace: "nowrap",
            }}
          >
            Loading Hexbin Layers...
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
      ) : hexbinOptions.length > 0 ? (
        // Data available: show label with dropdown selector
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
          <CommonSelect
            items={hexbinOptions}
            value={selectedHexbin}
            onSelectCallback={handleSelectHexbin}
            menuProps={menuProps}
            selectSx={selectProps}
          />
        </Stack>
      ) : null}
    </Box>
  );
};

export default HexbinLayerSelect;

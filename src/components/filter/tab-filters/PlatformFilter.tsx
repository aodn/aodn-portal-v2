import { FC, useCallback } from "react";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import { useAppDispatch } from "../../common/store/hooks";
import { updatePlatform } from "../../common/store/componentParamReducer";
import { TabFilterType } from "../Filters";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
import SatelliteIcon from "../../icon/platform/SatelliteIcon";
import GliderIcon from "../../icon/platform/GliderIcon";
import FloatIcon from "../../icon/platform/FloatIcon";
import MooringsBuoyIcon from "../../icon/platform/MooringsBuoyIcon";
import VesselIcon from "../../icon/platform/VesselIcon";
import AircraftIcon from "../../icon/platform/AircraftIcon";
import BioPlatformIcon from "../../icon/platform/BioPlatformIcon";
import RadarIcon from "../../icon/platform/RadarIcon";
import AUVIcon from "../../icon/platform/AUVIcon";
import rc8Theme from "../../../styles/themeRC8";

interface PlatformFilterProps extends TabFilterType {
  sx?: SxProps;
}

// The value needs to match ARDC AODN Platform Category Vocabulary
const PLATFORMS = [
  {
    value: "satellite",
    label: "Satellite",
    icon: <SatelliteIcon />,
  },
  {
    value: "glider",
    label: "Glider",
    icon: <GliderIcon />,
  },
  {
    value: "float",
    label: "Float",
    icon: <FloatIcon />,
  },
  {
    value: "mooring and buoy",
    label: "Moorings & Buoy",
    icon: <MooringsBuoyIcon />,
  },
  {
    value: "vessel",
    label: "Vessel",
    icon: <VesselIcon />,
  },
  {
    value: "aircraft",
    label: "Aircraft",
    icon: <AircraftIcon />,
  },
  {
    value: "biological platform",
    label: "Bio Platform",
    icon: <BioPlatformIcon />,
  },
  {
    value: "radar",
    label: "Radar",
    icon: <RadarIcon />,
  },
  {
    value: "auv",
    label: "AUV",
    icon: <AUVIcon />,
  },
];

const PlatformFilter: FC<PlatformFilterProps> = ({
  filters,
  setFilters,
  sx,
}) => {
  const dispatch = useAppDispatch();
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        platform: newAlignment,
      }));
      dispatch(updatePlatform(newAlignment));
    },
    [dispatch, setFilters]
  );

  return (
    <>
      <Box sx={{ ...sx }}>
        <StyledToggleButtonGroup
          value={filters.platform}
          onChange={handleChange}
          sx={{
            gap: "14px 20px",
            "& .MuiToggleButton-root": {
              borderRadius: "12px",
              textTransform: "capitalize",
              ...rc8Theme.typography.body1Medium,
              color: rc8Theme.palette.text1,
              "&.Mui-selected": {
                border: `3px solid ${rc8Theme.palette.primary1}`,
                backgroundColor: "#fff",
              },
            },
          }}
        >
          {PLATFORMS.map((item) => (
            <Box
              key={item.label}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <StyledToggleButton
                value={item.value}
                key={item.value}
                aria-label={item.label}
                sx={{
                  boxShadow: "0 0 6px 0 rgba(0, 0, 0, 0.25)",
                  backgroundColor: "#fff",
                  width: "96px",
                  height: "88px",
                }}
              >
                <Stack
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  direction="column"
                >
                  {item.icon && item.icon}
                </Stack>
              </StyledToggleButton>
              <Typography
                sx={{
                  ...rc8Theme.typography.title2Regular,
                  color: rc8Theme.palette.text1,
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  textAlign: "center",
                  maxWidth: "96px",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </StyledToggleButtonGroup>
      </Box>
    </>
  );
};

export default PlatformFilter;

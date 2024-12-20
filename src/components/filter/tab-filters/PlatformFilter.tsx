import { FC, useCallback } from "react";
import { Box, Stack, SxProps } from "@mui/material";
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

interface PlatformFilterProps extends TabFilterType {
  sx?: SxProps;
}

// TODO: fetch from ogcapi or align with ogcapi keywords
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
    value: "gloat",
    label: "Float",
    icon: <FloatIcon />,
  },
  {
    value: "moorings-buoy",
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
    value: "bio-platform",
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
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        platform: newAlignment,
      }));
    },
    [setFilters]
  );

  return (
    <>
      <Box sx={{ ...sx }}>
        <StyledToggleButtonGroup
          value={filters.platform}
          onChange={handleChange}
        >
          {PLATFORMS.map((item) => (
            <StyledToggleButton
              value={item.value}
              key={item.value}
              aria-label={item.label}
            >
              <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                {item.icon && item.icon}
                {item.label}
              </Stack>
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Box>
    </>
  );
};

export default PlatformFilter;

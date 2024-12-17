import { FC, useCallback } from "react";
import { Box, SxProps } from "@mui/material";
import { TabFilterType } from "../Filters";
import { StyledToggleButton } from "../../buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../buttons/StyledToggleButtonGroup";

interface PlatformFilterProps extends TabFilterType {
  sx?: SxProps;
}

// TODO: fetch from ogcapi or align with ogcapi keywords
const PLATFORMS = [
  {
    value: "satellite",
    label: "Satellite",
  },
  {
    value: "glider",
    label: "Glider",
  },
  {
    value: "gloat",
    label: "Float",
  },
  {
    value: "moorings-buoy",
    label: "Moorings & Buoy",
  },
  {
    value: "vessel",
    label: "Vessel",
  },
  {
    value: "aircraft",
    label: "Aircraft",
  },
  {
    value: "bio-platform",
    label: "Bio Platform",
  },
  {
    value: "radar",
    label: "Radar",
  },
  {
    value: "auv",
    label: "AUV",
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
          aria-label="parameter vocab selection"
        >
          {PLATFORMS.map((item) => (
            <StyledToggleButton
              value={item.value}
              key={item.value}
              aria-label={item.label}
            >
              {item.label}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Box>
    </>
  );
};

export default PlatformFilter;

import { FC, useCallback, useState } from "react";
import { Box, SxProps } from "@mui/material";
import { ItemButton, TabFilterType } from "../Filters";
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

const PlatformFilter: FC<PlatformFilterProps> = ({ sx }) => {
  // TODO: need to initialize the sate from parental filter
  const [platformFilter, setPlatformFilter] = useState<ItemButton[]>([]);

  // Update the local filter state
  // TODO: need to update parental filter instead if ogcapi support this query
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      const selected: ItemButton[] = PLATFORMS.filter((item) =>
        newAlignment.includes(item.value)
      );
      setPlatformFilter(selected);
    },
    []
  );
  return (
    <>
      <Box sx={{ ...sx }}>
        <StyledToggleButtonGroup
          value={platformFilter.map((item) => item.value)}
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

import { FC, useCallback } from "react";
import { Box, SxProps } from "@mui/material";
import { TabFilterType } from "../Filters";
import { StyledToggleButton } from "../../buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../buttons/StyledToggleButtonGroup";

interface OrganisationFilterProps extends TabFilterType {
  sx?: SxProps;
}

// TODO: fetch from ogcapi or align with ogcapi keywords
const ORGANISATION = [
  {
    value: "imos",
    label: "IMOS",
  },
  {
    value: "Australian-Universities",
    label: "Australian Universities",
  },
  {
    value: "department-agencies",
    label: "Department & Agencies",
  },
  {
    value: "industry",
    label: "Industry",
  },
  {
    value: "local-government",
    label: "Local Government",
  },
  {
    value: "international",
    label: "International",
  },
  {
    value: "non-government",
    label: "Non Government",
  },
  {
    value: "state-territory-agencies",
    label: "State & Territory Dpt. & Agencies",
  },
];

const OrganisationFilter: FC<OrganisationFilterProps> = ({
  filters,
  setFilters,
  sx,
}) => {
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        organisation: newAlignment,
      }));
    },
    [setFilters]
  );

  return (
    <>
      <Box sx={{ ...sx }}>
        <StyledToggleButtonGroup
          value={filters.organisation}
          onChange={handleChange}
          aria-label="parameter vocab selection"
        >
          {ORGANISATION.map((item) => (
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

export default OrganisationFilter;

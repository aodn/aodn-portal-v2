import React, { FC, useCallback } from "react";
import { Box, Stack, SxProps } from "@mui/material";
import { useAppDispatch } from "../../common/store/hooks";
import { updateDatasetGroup } from "../../common/store/componentParamReducer";
import { TabFilterType } from "../Filters";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
// import StateTerritoryAgenciesIcon from "../../icon/organisation/StateTerritoryAgenciesIcon";
// import AustralianUniversitiesIcon from "../../icon/organisation/AustralianUniversitiesIcon";
// import DepartmentAgenciesIcon from "../../icon/organisation/DepartmentAgenciesIcon";
// import IndustryIcon from "../../icon/organisation/IndustryIcon";
// import LocalGovernmentIcon from "../../icon/organisation/LocalGovernmentIcon";
// import InternationalIcon from "../../icon/organisation/InternationalIcon";
// import NonGovernmentIcon from "../../icon/organisation/NonGovernmentIcon";
import IMOSIcon from "../../icon/organisation/IMOSIcon";

interface OrganisationFilterProps extends TabFilterType {
  sx?: SxProps;
}

// TODO: comment items below and wait for ogcapi, can restore it in the future
// TODO: fetch from ogcapi or align with ogcapi keywords
const ORGANISATION = [
  {
    value: "imos",
    label: "IMOS",
    icon: <IMOSIcon />,
  },
  // {
  //   value: "Australian-Universities",
  //   label: "Australian Universities",
  //   icon: <AustralianUniversitiesIcon />,
  // },
  // {
  //   value: "department-agencies",
  //   label: "Department & Agencies",
  //   icon: <DepartmentAgenciesIcon />,
  // },
  // {
  //   value: "industry",
  //   label: "Industry",
  //   icon: <IndustryIcon />,
  // },
  // {
  //   value: "local-government",
  //   label: "Local Government",
  //   icon: <LocalGovernmentIcon />,
  // },
  // {
  //   value: "international",
  //   label: "International",
  //   icon: <InternationalIcon />,
  // },
  // {
  //   value: "non-government",
  //   label: "Non Government",
  //   icon: <NonGovernmentIcon />,
  // },
  // {
  //   value: "state-territory-agencies",
  //   label: "State & Territory Dpt. & Agencies",
  //   icon: <StateTerritoryAgenciesIcon />,
  // },
];

const OrganisationFilter: FC<OrganisationFilterProps> = ({
  filters,
  setFilters,
  sx,
}) => {
  const dispatch = useAppDispatch();
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        organisation: newAlignment,
      }));
      // Assume single selection for now.
      dispatch(updateDatasetGroup(newAlignment[0]));
    },
    [dispatch, setFilters]
  );

  return (
    <>
      <Box sx={{ ...sx }}>
        <StyledToggleButtonGroup
          value={filters.organisation}
          onChange={handleChange}
        >
          {ORGANISATION.map((item) => (
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

export default OrganisationFilter;

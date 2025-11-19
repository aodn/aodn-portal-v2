import React, { FC, useCallback } from "react";
import { Box, Stack, SxProps, Typography, useTheme } from "@mui/material";
import { useAppDispatch } from "../../common/store/hooks";
import { updateDatasetGroup } from "../../common/store/componentParamReducer";
import { TabFilterType } from "../Filters";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
import IMOSIcon from "../../icon/organisation/IMOSIcon";
import AustraliaAntarcticProgramIcon from "../../icon/organisation/AustraliaAntarcticProgramIcon";
import AIMSIcon from "../../icon/organisation/AIMSIcon";
import CSIROIcon from "../../icon/organisation/CSIROIcon";
import IMASIcon from "../../icon/organisation/IMASIcon";
import rc8Theme from "../../../styles/themeRC8";

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
  {
    value: "aims",
    label: "AIMS",
    icon: <AIMSIcon />,
  },
  {
    value: "australian_antarctic_division",
    label: "AAD",
    icon: <AustraliaAntarcticProgramIcon />,
  },
  {
    value: "csiro",
    label: "CSIRO",
    icon: <CSIROIcon />,
  },
  {
    value: "imas",
    label: "IMAS",
    icon: <IMASIcon />,
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
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string) => {
      setFilters((current) => {
        current.organisation =
          newAlignment !== null ? [newAlignment] : undefined;
        return current;
      });
      // Assume single selection for now.
      dispatch(
        updateDatasetGroup(newAlignment !== null ? newAlignment : undefined)
      );
    },
    [dispatch, setFilters]
  );

  return (
    <>
      <Box sx={{ ...sx }}>
        <StyledToggleButtonGroup
          exclusive
          value={filters.organisation?.[0]}
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
                backgroundColor: theme.palette.common.white,
              },
            },
          }}
        >
          {ORGANISATION.map(({ value, label, icon }, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <StyledToggleButton
                value={value}
                aria-label={label}
                sx={{
                  boxShadow: theme.shadows[7],
                  backgroundColor: theme.palette.common.white,
                  height: "88px",
                  width: "96px",
                }}
              >
                <Stack
                  sx={{
                    display: "row",
                    justifyContent: "center",
                    alignItem: "center",
                  }}
                >
                  {icon && icon}
                </Stack>
              </StyledToggleButton>
              <Typography
                sx={{
                  ...rc8Theme.typography.title2Regular,
                  color: rc8Theme.palette.text1,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </StyledToggleButtonGroup>
      </Box>
    </>
  );
};

export default OrganisationFilter;

import React, { FC, useCallback } from "react";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import {
  updateHasData,
  updateUpdateFreq,
} from "../../common/store/componentParamReducer";
import { useAppDispatch } from "../../common/store/hooks";
import { TabFilterType } from "../Filters";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { DatasetFrequency } from "../../common/store/searchReducer";
import { IndexDataType, ItemButton } from "../FilterDefinition";
import { portalTheme } from "../../../styles";

enum DataSettingsCategory {
  dataDeliverMode = "dataDeliveryMode",
  dataDeliveryFrequency = "dataDeliveryFrequency",
  dataIndexedType = "dataIndexedType",
  dataService = "dataService",
}

type DataSettingsFilterType = Record<DataSettingsCategory, ItemButton[]>;

const DATA_SETTINGS: DataSettingsFilterType = {
  dataDeliveryFrequency: [
    {
      value: DatasetFrequency.REALTIME,
      label: "Real Time",
    },
    {
      value: DatasetFrequency.DELAYED,
      label: "Delayed",
    },
    {
      value: DatasetFrequency.OTHER,
      label: "One-off",
    },
  ],
  dataIndexedType: [
    {
      value: IndexDataType.CLOUD,
      label: "Yes",
    },
  ],
  dataDeliveryMode: [
    {
      value: "yearly",
      label: "Yearly",
    },
    {
      value: "quarterly",
      label: "Quarterly",
    },
    {
      value: "monthly",
      label: "Monthly",
    },
    {
      value: "daily",
      label: "Daily",
    },
  ],
  dataService: [
    {
      value: "WMS",
      label: "WMS",
    },
    {
      value: "WFS",
      label: "WFS",
    },
    {
      value: "THREDDS",
      label: "THREDDS",
    },
  ],
};

interface DataSettingsFilterProps extends TabFilterType {
  sx?: SxProps;
}

const DataSettingsFilter: FC<DataSettingsFilterProps> = ({
  filters,
  setFilters,
  sx,
}) => {
  const dispatch = useAppDispatch();

  // Update the local filter state and redux for a specific category
  const handleChange = useCallback(
    (category: DataSettingsCategory) =>
      (
        _: React.MouseEvent<HTMLElement>,
        newAlignment: DatasetFrequency | Array<IndexDataType> | Array<string>
      ) => {
        if (category === DataSettingsCategory.dataDeliveryFrequency) {
          const value = newAlignment as DatasetFrequency;
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataDeliveryFrequency:
              value === null
                ? undefined
                : ([newAlignment] as Array<DatasetFrequency>),
          }));
          dispatch(updateUpdateFreq(value === null ? undefined : value));
        }
        if (category === DataSettingsCategory.dataDeliverMode) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataDeliveryMode: newAlignment as Array<string>,
          }));
        }
        if (category === DataSettingsCategory.dataService) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataService: newAlignment as Array<string>,
          }));
        }
        if (category === DataSettingsCategory.dataIndexedType) {
          const values = newAlignment as Array<IndexDataType>;
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataIndexedType: newAlignment as Array<IndexDataType>,
          }));
          dispatch(updateHasData(values?.includes(IndexDataType.CLOUD)));
        }
      },
    [dispatch, setFilters]
  );

  return (
    <Stack direction="column" spacing={2} sx={sx}>
      {/* TODO: Comment blocks below and wait for ogcapi, can restore it in the future  */}
      {/* <Box>
        <Typography
          p={0}
          pl={1}
          fontWeight={fontWeight.bold}
          color={fontColor.blue.dark}
        >
          Data Delivery Mode
        </Typography>
        <StyledToggleButtonGroup
          value={filters.dataDeliveryMode}
          onChange={handleChange(DataSettingsCategory.dataDeliverMode)}
        >
          {DATA_SETTINGS.dataDeliveryMode.map((item) => (
            <StyledToggleButton
              value={item.value}
              key={item.value}
              aria-label={item.label}
            >
              {item.label}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Box> */}
      <Box>
        <Typography
          sx={{
            ...portalTheme.typography.title1Medium,
            color: portalTheme.palette.text1,
            fontWeight: 500,
            padding: "8px 20px",
          }}
        >
          Data Delivery Mode
        </Typography>
        <StyledToggleButtonGroup
          exclusive={true}
          value={filters.dataDeliveryFrequency?.[0]}
          onChange={handleChange(DataSettingsCategory.dataDeliveryFrequency)}
          sx={{
            gap: "14px 12px",
            "& .MuiToggleButton-root": {
              borderRadius: "6px",
              textTransform: "capitalize",
              ...portalTheme.typography.title2Regular,
              color: portalTheme.palette.text1,
              bgcolor: "#fff",
              border: `1px solid ${portalTheme.palette.grey500}`,
              px: "38px",
              py: "8px",
              "&.Mui-selected": {
                border: "none",
                bgcolor: portalTheme.palette.primary1,
                color: "#fff",
              },
            },
          }}
        >
          {DATA_SETTINGS.dataDeliveryFrequency.map((item) => (
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
      <Box>
        <Typography
          sx={{
            ...portalTheme.typography.title1Medium,
            color: portalTheme.palette.text1,
            fontWeight: 500,
            padding: "8px 20px",
          }}
        >
          Download Service Availablility
        </Typography>
        <StyledToggleButtonGroup
          value={filters.dataIndexedType}
          onChange={handleChange(DataSettingsCategory.dataIndexedType)}
          sx={{
            gap: "14px 12px",
            "& .MuiToggleButton-root": {
              borderRadius: "6px",
              textTransform: "capitalize",
              ...portalTheme.typography.title2Regular,
              color: portalTheme.palette.text1,
              bgcolor: "#fff",
              border: `1px solid ${portalTheme.palette.grey500}`,
              px: "38px",
              py: "8px",
              "&.Mui-selected": {
                border: "none",
                bgcolor: portalTheme.palette.primary1,
                color: "#fff",
              },
            },
          }}
        >
          {DATA_SETTINGS.dataIndexedType.map((item) => (
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
      {/* <Box>
        <Typography
          variant="title1Medium"
          color={portalTheme.palette.text1}
          sx={{ padding: "8px 20px" }}
        >
          Data Service
        </Typography>
        <StyledToggleButtonGroup
          value={filters.dataService}
          onChange={handleChange(DataSettingsCategory.dataService)}
        >
          {DATA_SETTINGS.dataService.map((item) => (
            <StyledToggleButton
              value={item.value}
              key={item.value}
              aria-label={item.label}
            >
              {item.label}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Box> */}
    </Stack>
  );
};

export default DataSettingsFilter;

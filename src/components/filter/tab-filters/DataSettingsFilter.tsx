import { FC, useCallback, useEffect, useState } from "react";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import { ItemButton, TabFilterType } from "../Filters";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { fontColor, fontWeight } from "../../../styles/constants";
import { DatasetFrequency } from "../../common/store/searchReducer";

enum DataSettingsCategory {
  dataDeliverMode = "dataDeliveryMode",
  dataDeliveryFrequency = "dataDeliveryFrequency",
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
  // Update the local filter state for a specific category
  const handleChange = useCallback(
    (category: DataSettingsCategory) =>
      (
        _: React.MouseEvent<HTMLElement>,
        newAlignment: Array<DatasetFrequency>
      ) => {
        if (category === DataSettingsCategory.dataDeliveryFrequency) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataDeliveryFrequency: newAlignment,
          }));
        }
        if (category === DataSettingsCategory.dataDeliverMode) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataDeliveryMode: newAlignment,
          }));
        }
        if (category === DataSettingsCategory.dataService) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataService: newAlignment,
          }));
        }
      },
    [setFilters]
  );

  return (
    <Stack direction="column" spacing={2} sx={sx}>
      <Box>
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
      </Box>
      <Box>
        <Typography
          p={0}
          pl={1}
          fontWeight={fontWeight.bold}
          color={fontColor.blue.dark}
        >
          Data Delivery Frequency
        </Typography>
        <StyledToggleButtonGroup
          value={filters.dataDeliveryFrequency}
          onChange={handleChange(DataSettingsCategory.dataDeliveryFrequency)}
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
          p={0}
          pl={1}
          fontWeight={fontWeight.bold}
          color={fontColor.blue.dark}
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
      </Box>
    </Stack>
  );
};

export default DataSettingsFilter;

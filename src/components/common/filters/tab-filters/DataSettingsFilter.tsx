import { FC, useCallback, useState } from "react";
import { Box, Stack, SxProps } from "@mui/material";
import { ItemButton, TabFilterType } from "../Filters";
import { StyledToggleButtonGroup } from "../../buttons/StyledToggleButtonGroup";
import { StyledToggleButton } from "../../buttons/StyledToggleButton";

type DataSettingsCategory =
  | "dataDeliveryMode"
  | "dataDeliveryFrequency"
  | "dataService";

type DataSettingsFilterType = Record<DataSettingsCategory, ItemButton[]>;

const DATA_SETTINGS: DataSettingsFilterType = {
  dataDeliveryMode: [
    {
      value: "real-time",
      label: "Real Time",
    },
    {
      value: "Delayed",
      label: "delayed",
    },
    {
      value: "one-off",
      label: "One-off",
    },
  ],
  dataDeliveryFrequency: [
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

const DataSettingsFilter: FC<DataSettingsFilterProps> = ({ sx }) => {
  // Initialize state with empty arrays for each category
  const [dataSettingsFilter, setDataSettingsFilter] =
    useState<DataSettingsFilterType>({
      dataDeliveryMode: [],
      dataDeliveryFrequency: [],
      dataService: [],
    });

  // Update the local filter state for a specific category
  const handleChange = useCallback(
    (category: DataSettingsCategory) =>
      (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
        const selected: ItemButton[] = DATA_SETTINGS[category].filter((item) =>
          newAlignment.includes(item.value)
        );

        setDataSettingsFilter((prev) => ({
          ...prev,
          [category]: selected,
        }));
      },
    []
  );

  // Helper function to get selected values for a category
  const getSelectedValues = useCallback(
    (category: DataSettingsCategory) => {
      return dataSettingsFilter[category].map((item) => item.value);
    },
    [dataSettingsFilter]
  );

  return (
    <Stack direction="column" spacing={2} sx={sx}>
      <Box>
        <Box sx={{ mb: 1 }}>Data Delivery Mode</Box>
        <StyledToggleButtonGroup
          value={getSelectedValues("dataDeliveryMode")}
          onChange={handleChange("dataDeliveryMode")}
          aria-label="data delivery mode selection"
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
        <Box sx={{ mb: 1 }}>Data Delivery Frequency</Box>
        <StyledToggleButtonGroup
          value={getSelectedValues("dataDeliveryFrequency")}
          onChange={handleChange("dataDeliveryFrequency")}
          aria-label="data delivery frequency selection"
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
        <Box sx={{ mb: 1 }}>Data Service</Box>
        <StyledToggleButtonGroup
          value={getSelectedValues("dataService")}
          onChange={handleChange("dataService")}
          aria-label="data service selection"
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

import { FC, useCallback } from "react";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import { TabFilterType } from "../Filters";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { fontColor, fontWeight } from "../../../styles/constants";
import { DatasetFrequency } from "../../common/store/searchReducer";
import { IndexDataType, ItemButton } from "../FilterDefinition";

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
  // Update the local filter state for a specific category
  const handleChange = useCallback(
    (category: DataSettingsCategory) =>
      (
        _: React.MouseEvent<HTMLElement>,
        newAlignment: Array<DatasetFrequency> | Array<IndexDataType>
      ) => {
        if (category === DataSettingsCategory.dataDeliveryFrequency) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataDeliveryFrequency: newAlignment as Array<DatasetFrequency>,
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
        if (category === DataSettingsCategory.dataIndexedType) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            dataIndexedType: newAlignment as Array<IndexDataType>,
          }));
        }
      },
    [setFilters]
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
          Data Available
        </Typography>
        <StyledToggleButtonGroup
          value={filters.dataIndexedType}
          onChange={handleChange(DataSettingsCategory.dataIndexedType)}
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
      </Box> */}
    </Stack>
  );
};

export default DataSettingsFilter;

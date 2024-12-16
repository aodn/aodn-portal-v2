import {
  Dispatch,
  ElementType,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { ParameterState } from "../store/componentParamReducer";
import store, { getComponentState } from "../store/store";
import { Box, Button, SxProps, useTheme } from "@mui/material";

import { borderRadius, color, padding } from "../../../styles/constants";
import TabsPanelContainer, { Tab } from "../tab/TabsPanelContainer";
import ThemeFilter from "./tab-filters/ThemeFilter";
import PlatformFilter from "./tab-filters/PlatformFilter";
import OrganisationFilter from "./tab-filters/OrganisationFilter";
import DataSettingsFilter from "./tab-filters/DataSettingsFilter";

export interface ItemButton {
  value: string;
  label: string;
  icon?: ElementType;
}

export interface TabFilterType {
  filter: ParameterState;
  setFilter: Dispatch<SetStateAction<ParameterState>>;
}

interface FiltersProps extends TabFilterType {
  handleCloseFilter: () => void;
  handleApplyFilter: (filter: ParameterState) => void;
  sx?: SxProps;
}

const Filters: FC<FiltersProps> = ({
  handleCloseFilter,
  filter,
  setFilter,
  handleApplyFilter,
  sx = {},
}) => {
  const theme = useTheme();

  const componentParam = getComponentState(store.getState());
  const TABS: Tab[] = useMemo(() => {
    return [
      {
        label: "Themes",
        value: "themes",
        component: <ThemeFilter filter={filter} setFilter={setFilter} />,
      },
      {
        label: "Platform",
        value: "platform",
        component: <PlatformFilter filter={filter} setFilter={setFilter} />,
      },
      {
        label: "Organisation",
        value: "organisation",
        component: <OrganisationFilter filter={filter} setFilter={setFilter} />,
      },
      {
        label: "Data Settings",
        value: "data-settings",
        component: <DataSettingsFilter filter={filter} setFilter={setFilter} />,
      },
    ];
  }, [filter, setFilter]);

  useEffect(() => {
    if (componentParam) {
      setFilter(componentParam);
    }
  }, [componentParam, setFilter]);

  const handleClose = useCallback(() => {
    handleCloseFilter();
    setFilter({});
  }, [handleCloseFilter, setFilter]);

  const onClearAll = useCallback(() => {
    setFilter({});
  }, [setFilter]);

  return (
    <>
      <Box sx={{ width: "100%", ...sx }}>
        <TabsPanelContainer tabs={TABS} />
        <Box display="flex" justifyContent="end" alignItems="center">
          <Button
            sx={{
              width: "100px",
              borderRadius: borderRadius.small,
              paddingX: padding.medium,
              "&:hover": {
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={() => handleApplyFilter(filter)}
          >
            Apply All
          </Button>
          <Button
            sx={{
              width: "100px",
              borderRadius: borderRadius.small,
              paddingX: padding.medium,
              "&:hover": {
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Filters;

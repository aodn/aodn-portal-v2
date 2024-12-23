import {
  Dispatch,
  ElementType,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  updateImosOnly,
  updateParameterVocabs,
  updatePlatform,
  updateUpdateFreq,
  Vocab,
} from "../common/store/componentParamReducer";
import store, { getComponentState } from "../common/store/store";
import { Box, Button, IconButton, SxProps } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { border, color, gap } from "../../styles/constants";
import TabsPanelContainer, { Tab } from "../common/tab/TabsPanelContainer";
import ThemeFilter from "./tab-filters/ThemeFilter";
import PlatformFilter from "./tab-filters/PlatformFilter";
import OrganisationFilter from "./tab-filters/OrganisationFilter";
import DataSettingsFilter from "./tab-filters/DataSettingsFilter";
import { DatasetFrequency } from "../common/store/searchReducer";
import { useAppDispatch } from "../common/store/hooks";

export interface ItemButton {
  value: DatasetFrequency | string;
  label: string;
  icon?: ElementType;
}

// The type of each item in Filters should consistent with ParameterState
// TODO: For now all the button groups below are multi selection, need to keep consistent with ogcapi
interface Filters {
  parameterVocabs?: Array<Vocab>;
  platform?: Array<string>;
  organisation?: Array<string>;
  dataDeliveryFrequency?: Array<DatasetFrequency> | undefined;
  dataDeliveryMode?: Array<string>;
  dataService?: Array<string>;
}

export interface TabFilterType {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}
interface FiltersProps {
  handleClosePopup: () => void;
  sx?: SxProps;
}

enum FiltersTabs {
  Themes = "themes",
  Platform = "platform",
  Organisation = "organisation",
  DataSettings = "data-settings",
}

const checkBadge = (filters: Filters, tabName: FiltersTabs): boolean => {
  switch (tabName) {
    case FiltersTabs.Themes:
      return !!filters.parameterVocabs?.length;

    case FiltersTabs.Platform:
      return !!filters.platform?.length;

    case FiltersTabs.Organisation:
      return !!filters.organisation?.length;

    case FiltersTabs.DataSettings:
      return !!(
        filters.dataDeliveryFrequency?.length ||
        filters.dataDeliveryMode?.length ||
        filters.dataService?.length
      );

    default:
      return false;
  }
};

const Filters: FC<FiltersProps> = ({ handleClosePopup, sx }) => {
  const dispatch = useAppDispatch();

  const { parameterVocabs, platform, updateFreq, isImosOnlyDataset } =
    getComponentState(store.getState());

  const [filters, setFilters] = useState<Filters>({});

  const TABS: Tab[] = useMemo(() => {
    return [
      {
        label: "Themes",
        value: FiltersTabs.Themes,
        component: <ThemeFilter filters={filters} setFilters={setFilters} />,
        showBadge: checkBadge(filters, FiltersTabs.Themes),
      },
      {
        label: "Platform",
        value: FiltersTabs.Platform,
        component: <PlatformFilter filters={filters} setFilters={setFilters} />,
        showBadge: checkBadge(filters, FiltersTabs.Platform),
      },
      {
        label: "Organisation",
        value: FiltersTabs.Organisation,
        component: (
          <OrganisationFilter filters={filters} setFilters={setFilters} />
        ),
        showBadge: checkBadge(filters, FiltersTabs.Organisation),
      },
      {
        label: "Data Settings",
        value: FiltersTabs.DataSettings,
        component: (
          <DataSettingsFilter filters={filters} setFilters={setFilters} />
        ),
        showBadge: checkBadge(filters, FiltersTabs.DataSettings),
      },
    ];
  }, [filters, setFilters]);

  // TODO: implement other filters once ogcapi support them
  const handleApply = useCallback(
    (filters: Filters) => {
      if (filters.parameterVocabs) {
        dispatch(updateParameterVocabs(filters.parameterVocabs));
      } else {
        dispatch(updateParameterVocabs([]));
      }
      // TODO: isImosOnly is integrated in organisation button group, need to change ogcapi then change front end
      if (filters.organisation?.includes("imos")) {
        dispatch(updateImosOnly(true));
      } else {
        dispatch(updateImosOnly(false));
      }
      if (filters.platform) {
        dispatch(updatePlatform(filters.platform));
      } else {
        dispatch(updatePlatform([]));
      }
      // Since the ogcapi only accept single string for dataDeliveryFrequency, just update with the first item in the array.
      // TODO: need to confirm if we need multiple selection
      if (filters.dataDeliveryFrequency) {
        dispatch(updateUpdateFreq(filters.dataDeliveryFrequency[0]));
      } else {
        dispatch(updateUpdateFreq(undefined));
      }
      handleClosePopup();
    },
    [dispatch, handleClosePopup]
  );

  const handleClearAll = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const handleClose = useCallback(() => {
    handleClosePopup();
    handleClearAll();
  }, [handleClearAll, handleClosePopup]);

  useEffect(() => {
    if (parameterVocabs) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        parameterVocabs,
      }));
    }
    if (platform) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        platform,
      }));
    }
    if (updateFreq) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dataDeliveryFrequency: [updateFreq],
      }));
    }
    if (isImosOnlyDataset) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        organisation: ["imos"],
      }));
    }
  }, [isImosOnlyDataset, parameterVocabs, platform, updateFreq]);

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", ...sx }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: gap.lg, right: gap.lg, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <TabsPanelContainer tabs={TABS} sx={{ color: color.blue.xLight }} />
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          gap={2}
          pr={2}
          pb={2}
        >
          <Button
            sx={{
              width: "100px",

              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={() => handleApply(filters)}
          >
            Apply All
          </Button>
          <Button
            sx={{
              width: "100px",

              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Filters;

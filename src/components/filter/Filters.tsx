import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box, Button, IconButton, SxProps } from "@mui/material";
import {
  updateHasData,
  updateImosOnly,
  updateParameterVocabs,
  updatePlatform,
  updateUpdateFreq,
  Vocab,
} from "../common/store/componentParamReducer";
import { useAppDispatch, useAppSelector } from "../common/store/hooks";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import { color, fontSize, gap } from "../../styles/constants";
import TabsPanelContainer, { Tab } from "../common/tab/TabsPanelContainer";
import ThemeFilter from "./tab-filters/ThemeFilter";
import PlatformFilter from "./tab-filters/PlatformFilter";
import OrganisationFilter from "./tab-filters/OrganisationFilter";
import DataSettingsFilter from "./tab-filters/DataSettingsFilter";
import { DatasetFrequency } from "../common/store/searchReducer";
import { IndexDataType } from "./FilterDefinition";

enum FiltersTabs {
  Parameters = "parameters",
  Platform = "platform",
  Organisation = "organisation",
  DataSettings = "data-settings",
}

// The type of each item in Filters should consistent with ParameterState
// TODO: For now all the button groups below are multi selection, need to keep consistent with ogcapi
interface Filters {
  parameterVocabs?: Array<Vocab>;
  platform?: Array<string>;
  organisation?: Array<string>;
  dataDeliveryFrequency?: Array<DatasetFrequency> | undefined;
  dataDeliveryMode?: Array<string>;
  dataIndexedType?: Array<IndexDataType>;
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

const TAB_MAX_HEIGHT = 300;

const checkBadge = (filters: Filters, tabName: FiltersTabs): boolean => {
  switch (tabName) {
    case FiltersTabs.Parameters:
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

  const {
    parameterVocabs,
    platform,
    updateFreq,
    isImosOnlyDataset,
    hasCOData,
  } = useAppSelector((state) => state.paramReducer);

  const [filters, setFilters] = useState<Filters>({});

  const TABS: Tab[] = useMemo(() => {
    return [
      {
        label: "Parameters",
        value: FiltersTabs.Parameters,
        component: (
          <ThemeFilter
            filters={filters}
            setFilters={setFilters}
            sx={{ maxHeight: TAB_MAX_HEIGHT, overflowY: "scroll" }}
          />
        ),
        showBadge: checkBadge(filters, FiltersTabs.Parameters),
      },
      {
        label: "Platform",
        value: FiltersTabs.Platform,
        component: (
          <PlatformFilter
            filters={filters}
            setFilters={setFilters}
            sx={{ maxHeight: TAB_MAX_HEIGHT, overflowY: "scroll" }}
          />
        ),
        showBadge: checkBadge(filters, FiltersTabs.Platform),
      },
      {
        label: "Organisation",
        value: FiltersTabs.Organisation,
        component: (
          <OrganisationFilter
            filters={filters}
            setFilters={setFilters}
            sx={{ maxHeight: TAB_MAX_HEIGHT, overflowY: "scroll" }}
          />
        ),
        showBadge: checkBadge(filters, FiltersTabs.Organisation),
      },
      {
        label: "Data",
        value: FiltersTabs.DataSettings,
        component: (
          <DataSettingsFilter
            filters={filters}
            setFilters={setFilters}
            sx={{ maxHeight: TAB_MAX_HEIGHT, overflowY: "scroll" }}
          />
        ),
        showBadge: checkBadge(filters, FiltersTabs.DataSettings),
      },
    ];
  }, [filters, setFilters]);

  const handleClearAll = useCallback(() => {
    setFilters({});
    dispatch(updateParameterVocabs([]));
    dispatch(updateImosOnly(undefined));
    dispatch(updateHasData(undefined));
    dispatch(updatePlatform([]));
    dispatch(updateUpdateFreq(undefined));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    handleClosePopup();
  }, [handleClosePopup]);

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
    if (hasCOData) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dataIndexedType: [IndexDataType.CLOUD],
      }));
    }
  }, [hasCOData, isImosOnlyDataset, parameterVocabs, platform, updateFreq]);

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", ...sx }}>
        <Box
          sx={{
            position: "absolute",
            top: gap.md,
            right: gap.md,
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={handleClearAll}
            sx={{
              bgcolor: color.gray.extraLight,
              "&:hover": {
                bgcolor: color.blue.darkSemiTransparent,
              },
            }}
          >
            <ReplayIcon sx={{ fontSize: fontSize.info }} />
          </IconButton>
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: color.gray.extraLight,
              "&:hover": {
                bgcolor: color.blue.darkSemiTransparent,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: fontSize.info }} />
          </IconButton>
        </Box>
        <TabsPanelContainer tabs={TABS} sx={{ color: color.blue.xLight }} />
      </Box>
    </>
  );
};

export default Filters;

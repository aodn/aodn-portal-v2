import {
  Dispatch,
  FC,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { Box, SxProps } from "@mui/material";
import { Vocab } from "../common/store/componentParamReducer";
import { useAppSelector } from "../common/store/hooks";
import TabsPanelContainer, { Tab } from "../common/tab/TabsPanelContainer";
import ThemeFilter from "./tab-filters/ThemeFilter";
import PlatformFilter from "./tab-filters/PlatformFilter";
import OrganisationFilter from "./tab-filters/OrganisationFilter";
import DataSettingsFilter from "./tab-filters/DataSettingsFilter";
import { DatasetFrequency, DatasetStatus } from "../common/store/searchReducer";
import { IndexDataType } from "./FilterDefinition";
import { portalTheme } from "../../styles";

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
  dataStatus?: Array<DatasetStatus> | undefined;
  dataIndexedType?: Array<IndexDataType>;
  dataService?: Array<string>;
}

export interface TabFilterType {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}
interface FiltersProps {
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
        filters.dataService?.length ||
        filters.dataIndexedType?.length ||
        filters.dataStatus?.length
      );

    default:
      return false;
  }
};

const FiltersFC: FC<FiltersProps> = ({ sx }) => {
  const {
    parameterVocabs,
    platform,
    updateFreq,
    datasetGroup,
    hasCOData,
    datasetStatus,
  } = useAppSelector((state) => state.paramReducer);

  const [filters, setFilters] = useState<Filters>({});
  // Do not use useMemo here due to change in filters items not filters
  const TABS: Tab[] = [
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

  useEffect(() => {
    startTransition(() => {
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
      if (datasetGroup) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          organisation: [datasetGroup],
        }));
      }
      if (hasCOData) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          dataIndexedType: [IndexDataType.CLOUD],
        }));
      }
      if (datasetStatus) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          dataStatus: [datasetStatus],
        }));
      }
    });
  }, [
    hasCOData,
    datasetGroup,
    parameterVocabs,
    platform,
    updateFreq,
    datasetStatus,
  ]);

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", ...sx }}>
        <TabsPanelContainer
          tabs={TABS}
          sx={{
            "& .MuiTabs-root": {
              backgroundColor: portalTheme.palette.primary6,
              px: "28px",
            },
          }}
        />
      </Box>
    </>
  );
};

export default FiltersFC;

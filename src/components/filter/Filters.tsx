import { FC, startTransition, useEffect, useState } from "react";
import { alpha, Box, SxProps } from "@mui/material";
import { useAppSelector } from "@/app/store/hooks";
import TabsPanelContainer, { Tab } from "../common/tab/TabsPanelContainer";
import ThemeFilter from "./tab-filters/ThemeFilter";
import PlatformFilter from "./tab-filters/PlatformFilter";
import OrganisationFilter from "./tab-filters/OrganisationFilter";
import DataSettingsFilter from "./tab-filters/DataSettingsFilter";
import { FilterValues, IndexDataType } from "./FilterDefinition";
import { portalTheme } from "@/styles";
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from "@/app/layout/constant";

enum FiltersTabs {
  Parameters = "parameters",
  Platform = "platform",
  Organisation = "organisation",
  DataSettings = "data-settings",
}

interface FiltersProps {
  sx?: SxProps;
}

// Number of values selected in a tab, shown in its badge
const countSelected = (filters: FilterValues, tabName: FiltersTabs): number => {
  switch (tabName) {
    case FiltersTabs.Parameters:
      return filters.parameterVocabs?.length ?? 0;

    case FiltersTabs.Platform:
      return filters.platform?.length ?? 0;

    case FiltersTabs.Organisation:
      return filters.organisation?.length ?? 0;

    case FiltersTabs.DataSettings:
      return [
        filters.dataDeliveryFrequency,
        filters.dataDeliveryMode,
        filters.dataService,
        filters.dataIndexedType,
        filters.excludeDocument,
        filters.dataStatus,
      ].reduce((total, values) => total + (values?.length ?? 0), 0);

    default:
      return 0;
  }
};

const FiltersFC: FC<FiltersProps> = ({ sx }) => {
  const {
    parameterVocabs,
    platform,
    updateFreq,
    datasetGroup,
    hasCOData,
    excludeDocument,
    datasetStatus,
  } = useAppSelector((state) => state.paramReducer);

  const [filters, setFilters] = useState<FilterValues>({});
  // Do not use useMemo here due to change in filters items not filters
  const TABS: Tab[] = [
    {
      label: "Parameters",
      value: FiltersTabs.Parameters,
      component: <ThemeFilter filters={filters} setFilters={setFilters} />,
      badgeContent: countSelected(filters, FiltersTabs.Parameters),
    },
    {
      label: "Platform",
      value: FiltersTabs.Platform,
      component: <PlatformFilter filters={filters} setFilters={setFilters} />,
      badgeContent: countSelected(filters, FiltersTabs.Platform),
    },
    {
      label: "Organisation",
      value: FiltersTabs.Organisation,
      component: (
        <OrganisationFilter filters={filters} setFilters={setFilters} />
      ),
      badgeContent: countSelected(filters, FiltersTabs.Organisation),
    },
    {
      label: "Data",
      value: FiltersTabs.DataSettings,
      component: (
        <DataSettingsFilter filters={filters} setFilters={setFilters} />
      ),
      badgeContent: countSelected(filters, FiltersTabs.DataSettings),
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
      setFilters((prevFilters) => ({
        ...prevFilters,
        excludeDocument: excludeDocument ? ["Yes"] : undefined,
      }));
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
    excludeDocument,
    datasetStatus,
  ]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          "& .MuiTabs-root": {
            backgroundColor: alpha(portalTheme.palette.primary6, 0.8),
            boxShadow:
              "inset 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 -2px 8px rgba(0, 0, 0, 0.08)",
            borderTopLeftRadius: portalTheme.designTokens.borderRadius.md,
            borderTopRightRadius: portalTheme.designTokens.borderRadius.md,
            borderBottom: "none",
            // The first tab adds its own 6px margin, giving a 36px inset
            px: { sm: "30px" },
          },
          "& .MuiTabs-root .MuiTab-root": { my: 2 },
          // Count badge centred 2px in from the tab's right edge and 3px down
          // from its top (the tab has 6px side and 16px top margins)
          "& .MuiTabs-root .MuiBadge-badge": { top: "19px", right: "8px" },
          // Every tab has the same height; it shrinks to fit short viewports
          // (header, search bar, chips row and tab bar above it) and scrolls.
          "& [role=tabpanel]": {
            boxSizing: "border-box",
            height: 440,
            maxHeight: {
              xs: `max(200px, calc(100dvh - ${HEADER_HEIGHT_MOBILE + 205}px))`,
              sm: `max(200px, calc(100dvh - ${HEADER_HEIGHT + 205}px))`,
            },
            overflowY: "auto",
          },
          ...sx,
        }}
      >
        <TabsPanelContainer tabs={TABS} />
      </Box>
    </>
  );
};

export default FiltersFC;

import { FC, lazy, Suspense, useCallback, useMemo, useState } from "react";
import DataAccessPanel from "@/pages/detail-page/features/DataAccessPanel";
import AdditionalInfoPanel from "@/pages/detail-page/features/AdditionalInfoPanel";
import CitationPanel from "@/pages/detail-page/features/CitationPanel";
import SummaryAndDownloadPanel from "@/pages/detail-page/features/SummaryAndDownloadPanel";
import AssociatedRecordsPanel from "@/pages/detail-page/features/AssociatedRecordsPanel";
import { IconSummary } from "@/components/icon/tabs/IconSummary";
import { IconDataAccess } from "@/components/icon/tabs/IconDataAccess";
import { IconCitation } from "@/components/icon/tabs/IconCitation";
import { IconInformation } from "@/components/icon/tabs/IconInformation3";
import { IconRelatedResources } from "@/components/icon/tabs/IconRelatedResources";
import { IconMap } from "@/components/icon/tabs/IconMap";
import { Box, Card, Skeleton } from "@mui/material";
import { borderRadius, padding } from "@/styles/constants";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import TabsPanelContainer, {
  Tab,
} from "@/components/common/tab/TabsPanelContainer";
import { useLocation, useParams } from "react-router-dom";
import type { LngLatBounds, MapEvent } from "mapbox-gl";
import { detailPageDefault, pageReferer } from "@/components/common/constants";
import useTabNavigation from "@/hooks/useTabNavigation";
import useBreakpoint from "@/hooks/useBreakpoint";
import notMatchingRecordImage from "@/assets/images/no_matching_record.webp";

// MapPanel pulls in mapbox-gl and, for gridded (zarr) records, fetches and
// parses the tile product listing. On mobile it lives behind the Map tab, so
// loading it eagerly put all of that on the Summary tab's critical path.
const MapPanel = lazy(() => import("@/pages/detail-page/features/MapPanel"));

// Same height as MapPanel's map container, so the fallback does not shift
// the page when the panel arrives.
const MAP_PANEL_MIN_HEIGHT = "588px";

interface ContentSectionProps {
  mapFocusArea?: LngLatBounds;
  onMapMoveEnd?: (evt: MapEvent) => void;
}

const findTabIndex = (params: URLSearchParams, tabs: Tab[]) => {
  const tabValue = params.get("tab");
  const index = tabs.findIndex((tab) => tab.value === tabValue);
  return index === -1 ? 0 : index;
};

const additionalInfoPanelTab: Tab = {
  label: "Additional Information",
  value: detailPageDefault.ADDITIONAL_INFO,
  component: <AdditionalInfoPanel />,
  icon: <IconInformation />,
};

const citationPanelTab: Tab = {
  label: "Citation and Usage",
  value: detailPageDefault.CITATION,
  component: <CitationPanel />,
  icon: <IconCitation />,
};

const dataAccessPanelTab: Tab = {
  label: "Data Access",
  value: detailPageDefault.DATA_ACCESS,
  component: <DataAccessPanel />,
  icon: <IconDataAccess />,
};

const associatedRecordsPanelTab: Tab = {
  label: "Related Resources",
  value: detailPageDefault.ASSOCIATED_RECORDS,
  component: <AssociatedRecordsPanel />,
  icon: <IconRelatedResources />,
};

const summaryTab: Tab = {
  label: "Summary",
  value: detailPageDefault.SUMMARY,
  component: <SummaryAndDownloadPanel />,
  icon: <IconSummary />,
};

const mapPanelTab: Tab = {
  label: "Map",
  value: detailPageDefault.MAP,
  component: <></>,
  icon: <IconMap />,
};

const ContentSection: FC<ContentSectionProps> = ({
  mapFocusArea,
  onMapMoveEnd,
}) => {
  const { uuid } = useParams();
  const tabNavigation = useTabNavigation();
  const { isMobile } = useBreakpoint();

  const TABS: Tab[] = useMemo(
    () =>
      isMobile
        ? [
            summaryTab,
            mapPanelTab,
            dataAccessPanelTab,
            citationPanelTab,
            additionalInfoPanelTab,
            associatedRecordsPanelTab,
          ]
        : [
            summaryTab,
            dataAccessPanelTab,
            citationPanelTab,
            additionalInfoPanelTab,
            associatedRecordsPanelTab,
          ],
    [isMobile]
  );

  const location = useLocation();
  const { isCollectionNotFound } = useDetailPageContext();
  // Once shown, the map stays mounted (just hidden) so switching tabs keeps
  // its state, the same way TabsPanelContainer keeps visited tabs.
  const [hasShownMapPane, setHasShownMapPane] = useState(false);

  const params: URLSearchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const handleTabChange = useCallback(
    (newValue: number) => {
      if (uuid) {
        tabNavigation(
          uuid,
          TABS[newValue].value,
          // Use search page referer here to make sure the user can navigate back to the search page
          pageReferer.SEARCH_PAGE_REFERER
        );
      }
    },
    [TABS, tabNavigation, uuid]
  );

  if (isCollectionNotFound) {
    return (
      <Box
        component="img"
        src={notMatchingRecordImage}
        alt="not found image"
        sx={{
          height: "70vh", // Set the height to 70% of the viewport height
          width: "100%",
          objectFit: "contain",
          objectPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }

  const selectedTabValue = TABS[findTabIndex(params, TABS)]?.value;
  const showMapPane = isMobile
    ? selectedTabValue === detailPageDefault.MAP
    : selectedTabValue === detailPageDefault.SUMMARY;
  if (showMapPane && !hasShownMapPane) {
    setHasShownMapPane(true);
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: "white",
          borderRadius: borderRadius.small,
        }}
      >
        <TabsPanelContainer
          key={uuid}
          lazyMount
          tabs={TABS}
          tabValue={findTabIndex(params, TABS)}
          handleTabChange={handleTabChange}
        />
      </Card>
      <Box
        sx={{
          display: showMapPane ? "block" : "none",
        }}
      >
        {(showMapPane || hasShownMapPane) && (
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                width="100%"
                height={MAP_PANEL_MIN_HEIGHT}
                aria-label="Map loading"
                sx={{
                  mt: padding.large,
                  mb: padding.large,
                  borderRadius: borderRadius.small,
                }}
              />
            }
          >
            <MapPanel mapFocusArea={mapFocusArea} onMapMoveEnd={onMapMoveEnd} />
          </Suspense>
        )}
      </Box>
    </>
  );
};

export default ContentSection;

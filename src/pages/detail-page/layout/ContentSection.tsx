import { FC, useCallback, useMemo } from "react";
import DataAccessPanel from "../features/DataAccessPanel";
import AdditionalInfoPanel from "../features/AdditionalInfoPanel";
import CitationPanel from "../features/CitationPanel";
import SummaryAndDownloadPanel from "../features/SummaryAndDownloadPanel";
import AssociatedRecordsPanel from "../features/AssociatedRecordsPanel";
import MapPanel from "../features/MapPanel";
import { IconSummary } from "../../../components/icon/tabs/IconSummary";
import { IconDataAccess } from "../../../components/icon/tabs/IconDataAccess";
import { IconCitation } from "../../../components/icon/tabs/IconCitation";
import { IconInformation } from "../../../components/icon/tabs/IconInformation3";
import { IconRelatedResources } from "../../../components/icon/tabs/IconRelatedResources";
import { IconMap } from "../../../components/icon/tabs/IconMap";
import { Box, Card } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import { useDetailPageContext } from "../context/detail-page-context";
import TabsPanelContainer, {
  Tab,
} from "../../../components/common/tab/TabsPanelContainer";
import { useLocation, useParams } from "react-router-dom";
import { LngLatBounds, MapEvent } from "mapbox-gl";
import {
  detailPageDefault,
  pageReferer,
} from "../../../components/common/constants";
import useTabNavigation from "../../../hooks/useTabNavigation";
import useBreakpoint from "../../../hooks/useBreakpoint";
import notMatchingRecordImage from "@/assets/images/no_matching_record.png";

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

const summaryOnlyTab: Tab = {
  label: "Summary",
  value: detailPageDefault.SUMMARY,
  component: <SummaryAndDownloadPanel />,
  icon: <IconSummary />,
};

const summaryWithMapTab = (
  mapFocusArea: LngLatBounds | undefined,
  onMapMoveEnd?: (evt: MapEvent) => void
): Tab => ({
  label: "Summary",
  value: detailPageDefault.SUMMARY,
  component: (
    <>
      <SummaryAndDownloadPanel />
      <MapPanel mapFocusArea={mapFocusArea} onMapMoveEnd={onMapMoveEnd} />
    </>
  ),
  icon: <IconSummary />,
});

const mapPanelTab = (
  mapFocusArea: LngLatBounds | undefined,
  onMapMoveEnd?: (evt: MapEvent) => void
): Tab => ({
  label: "Map",
  value: detailPageDefault.MAP,
  component: (
    <MapPanel mapFocusArea={mapFocusArea} onMapMoveEnd={onMapMoveEnd} />
  ),
  icon: <IconMap />,
});

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
            summaryOnlyTab,
            mapPanelTab(mapFocusArea, onMapMoveEnd),
            dataAccessPanelTab,
            citationPanelTab,
            additionalInfoPanelTab,
            associatedRecordsPanelTab,
          ]
        : [
            summaryWithMapTab(mapFocusArea, onMapMoveEnd),
            dataAccessPanelTab,
            citationPanelTab,
            additionalInfoPanelTab,
            associatedRecordsPanelTab,
          ],
    [mapFocusArea, onMapMoveEnd, isMobile]
  );

  const location = useLocation();
  const { isCollectionNotFound } = useDetailPageContext();

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

  return (
    <Card
      sx={{
        backgroundColor: "white",
        borderRadius: borderRadius.small,
      }}
    >
      <TabsPanelContainer
        tabs={TABS}
        tabValue={findTabIndex(params, TABS)}
        handleTabChange={handleTabChange}
      />
    </Card>
  );
};

export default ContentSection;

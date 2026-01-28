import { FC, useCallback, useEffect, useMemo, useState } from "react";
import DataAccessPanel from "./tab-panels/DataAccessPanel";
import AdditionalInfoPanel from "./tab-panels/AdditionalInfoPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import SummaryAndDownloadPanel from "./tab-panels/SummaryAndDownloadPanel";
import AssociatedRecordsPanel from "./tab-panels/AssociatedRecordsPanel";
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
};

const citationPanelTab: Tab = {
  label: "Citation and Usage",
  value: detailPageDefault.CITATION,
  component: <CitationPanel />,
};

const dataAccessPanelTab: Tab = {
  label: "Data Access",
  value: detailPageDefault.DATA_ACCESS,
  component: <DataAccessPanel />,
};

const associatedRecordsPanelTab: Tab = {
  label: "Related Resources",
  value: detailPageDefault.ASSOCIATED_RECORDS,
  component: <AssociatedRecordsPanel />,
};

const summaryAndDownloadPanelTab = (
  mapFocusArea: LngLatBounds | undefined,
  onMapMoveEnd?: (evt: MapEvent) => void,
  isActive?: boolean
): Tab => {
  return {
    label: "Summary",
    value: detailPageDefault.SUMMARY,
    component: (
      <SummaryAndDownloadPanel
        mapFocusArea={mapFocusArea}
        onMapMoveEnd={onMapMoveEnd}
        isTabActive={isActive}
      />
    ),
  };
};

const ContentSection: FC<ContentSectionProps> = ({
  mapFocusArea,
  onMapMoveEnd,
}) => {
  const { uuid } = useParams();
  const tabNavigation = useTabNavigation();
  const location = useLocation();
  const { isCollectionNotFound } = useDetailPageContext();

  const params: URLSearchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Initialize tabValue state early so it can be used in TABS memoization
  const [tabValue, setTabValue] = useState<number>(() => {
    // We need to create a temporary TABS array to find the initial index
    const tempTabs = [
      { value: detailPageDefault.SUMMARY },
      { value: detailPageDefault.DATA_ACCESS },
      { value: detailPageDefault.CITATION },
      { value: detailPageDefault.ADDITIONAL_INFO },
      { value: detailPageDefault.ASSOCIATED_RECORDS },
    ];
    return findTabIndex(params, tempTabs as Tab[]);
  });

  const TABS: Tab[] = useMemo(
    () => [
      summaryAndDownloadPanelTab(mapFocusArea, onMapMoveEnd, tabValue === 0),
      dataAccessPanelTab,
      citationPanelTab,
      additionalInfoPanelTab,
      associatedRecordsPanelTab,
    ],
    [mapFocusArea, onMapMoveEnd, tabValue]
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

  useEffect(() => {
    const index = findTabIndex(params, TABS);
    setTabValue(index);
  }, [TABS, params]);

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
        tabValue={tabValue}
        handleTabChange={handleTabChange}
      />
    </Card>
  );
};

export default ContentSection;

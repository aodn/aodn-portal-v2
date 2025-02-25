import { FC, useCallback, useEffect, useMemo, useState } from "react";
import DataAccessPanel from "./tab-panels/DataAccessPanel";
import AdditionalInfoPanel from "./tab-panels/AdditionalInfoPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import SummaryAndDownloadPanel from "./tab-panels/SummaryAndDownloadPanel";
import AssociatedRecordsPanel from "./tab-panels/AssociatedRecordsPanel";
import { Card, Grid } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import { useDetailPageContext } from "../context/detail-page-context";
import RecordNotFoundPanel from "./tab-panels/RecordNotFoundPanel";
import TabsPanelContainer, {
  Tab,
} from "../../../components/common/tab/TabsPanelContainer";
import { useLocation } from "react-router-dom";
import { LngLatBounds } from "mapbox-gl";
import { detailPageDefault } from "../../../components/common/constants";

interface ContentSectionProps {
  mapFocusArea?: LngLatBounds;
}

const findTabIndex = (params: URLSearchParams, tabs: Tab[]) => {
  const tabValue = params.get("tab");
  const index = tabs.findIndex((tab) => tab.value === tabValue);
  return index === -1 ? 0 : index;
};

const ContentSection: FC<ContentSectionProps> = ({ mapFocusArea }) => {
  const summaryAndDownloadPanelTab: Tab = useMemo(
    () => ({
      label: "Summary",
      value: detailPageDefault.SUMMARY,
      component: <SummaryAndDownloadPanel bbox={mapFocusArea} />,
    }),
    [mapFocusArea]
  );

  const additionalInfoPanelTab: Tab = useMemo(
    () => ({
      label: "Additional Information",
      value: detailPageDefault.ADDITIONAL_INFO,
      component: <AdditionalInfoPanel />,
    }),
    []
  );

  const dataAccessPanelTab: Tab = useMemo(
    () => ({
      label: "Data Access",
      value: detailPageDefault.DATA_ACCESS,
      component: <DataAccessPanel />,
    }),
    []
  );

  const citationPanelTab: Tab = useMemo(
    () => ({
      label: "Citation and Usage",
      value: detailPageDefault.CITATION,
      component: <CitationPanel />,
    }),
    []
  );

  const associatedRecordsPanelTab: Tab = useMemo(
    () => ({
      label: "Related Resources",
      value: detailPageDefault.ASSOCIATED_RECORDS,
      component: <AssociatedRecordsPanel />,
    }),
    []
  );

  const TABS: Tab[] = useMemo(
    () => [
      summaryAndDownloadPanelTab,
      dataAccessPanelTab,
      citationPanelTab,
      additionalInfoPanelTab,
      associatedRecordsPanelTab,
    ],
    [
      additionalInfoPanelTab,
      summaryAndDownloadPanelTab,
      associatedRecordsPanelTab,
      citationPanelTab,
      dataAccessPanelTab,
    ]
  );

  const location = useLocation();
  const { isCollectionNotFound } = useDetailPageContext();

  const params: URLSearchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [tabValue, setTabValue] = useState<number>(findTabIndex(params, TABS));

  const handleTabChange = useCallback(
    (newValue: number) => {
      // Update URL without navigating
      const newUrl = `${location.pathname}?uuid=${params.get("uuid")}&tab=${TABS[newValue].value}`;
      window.history.pushState(null, "", newUrl);
    },
    [TABS, location.pathname, params]
  );

  useEffect(() => {
    const index = findTabIndex(params, TABS);
    setTabValue(index);
  }, [TABS, params]);

  // if no collection found, unfocus the tab
  useEffect(() => {
    if (isCollectionNotFound) {
      setTabValue(-1);
    }
  }, [isCollectionNotFound]);

  return (
    <Card
      sx={{
        backgroundColor: "white",
        borderRadius: borderRadius.small,
      }}
    >
      <TabsPanelContainer
        tabs={TABS}
        isCollectionNotFound={isCollectionNotFound}
        tabValue={tabValue}
        handleTabChange={handleTabChange}
      />

      {isCollectionNotFound && (
        <Grid container sx={{ height: "1000px" }}>
          <RecordNotFoundPanel />
        </Grid>
      )}
    </Card>
  );
};

export default ContentSection;

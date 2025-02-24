import { FC, useCallback, useEffect, useMemo, useState } from "react";
import DataAccessPanel from "./tab-panels/DataAccessPanel";
import AboutPanel from "./tab-panels/AboutPanel";
import MetadataInformationPanel from "./tab-panels/MetadataInformationPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import SummaryAndDownloadPanel from "./tab-panels/SummaryAndDownloadPanel";
import LineagePanel from "./tab-panels/LineagePanel";
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

  const aboutPanelTab: Tab = useMemo(
    () => ({
      label: "About",
      value: detailPageDefault.ABOUT,
      component: <AboutPanel />,
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

  const lineagePanelTab: Tab = useMemo(
    () => ({
      label: "Lineage",
      value: detailPageDefault.LINEAGE,
      component: <LineagePanel />,
    }),
    []
  );

  const metadataInformationPanelTab: Tab = useMemo(
    () => ({
      label: "Metadata Information",
      value: detailPageDefault.METADATA_INFORMATION,
      component: <MetadataInformationPanel />,
    }),
    []
  );

  const citationPanelTab: Tab = useMemo(
    () => ({
      label: "Citation",
      value: detailPageDefault.CITATION,
      component: <CitationPanel />,
    }),
    []
  );

  const associatedRecordsPanelTab: Tab = useMemo(
    () => ({
      label: "Associated Records",
      value: detailPageDefault.ASSOCIATED_RECORDS,
      component: <AssociatedRecordsPanel />,
    }),
    []
  );

  const TABS: Tab[] = useMemo(
    () => [
      summaryAndDownloadPanelTab,
      dataAccessPanelTab,
      aboutPanelTab,
      lineagePanelTab,
      metadataInformationPanelTab,
      citationPanelTab,
      associatedRecordsPanelTab,
    ],
    [
      aboutPanelTab,
      summaryAndDownloadPanelTab,
      associatedRecordsPanelTab,
      citationPanelTab,
      lineagePanelTab,
      dataAccessPanelTab,
      metadataInformationPanelTab,
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

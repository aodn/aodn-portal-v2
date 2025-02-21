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
import TabsPanelContainer from "../../../components/common/tab/TabsPanelContainer";
import { useLocation } from "react-router-dom";
import { LngLatBounds } from "mapbox-gl";
import { detailPageDefault } from "../../../components/common/constants";

interface ContentSectionProps {
  mapFocusArea?: LngLatBounds;
}

const ContentSection: FC<ContentSectionProps> = ({ mapFocusArea }) => {
  const summaryAndDownloadPanelTab = useMemo(
    () => ({
      label: "Summary",
      value: detailPageDefault.SUMMARY,
      component: <SummaryAndDownloadPanel bbox={mapFocusArea} />,
    }),
    [mapFocusArea]
  );

  const aboutPanelTab = useMemo(
    () => ({
      label: "About",
      value: detailPageDefault.ABOUT,
      component: <AboutPanel />,
    }),
    []
  );

  const dataAccessPanelTab = useMemo(
    () => ({
      label: "Data Access",
      value: detailPageDefault.DATA_ACCESS,
      component: <DataAccessPanel />,
    }),
    []
  );

  const lineagePanelTab = useMemo(
    () => ({
      label: "Lineage",
      value: detailPageDefault.LINEAGE,
      component: <LineagePanel />,
    }),
    []
  );

  const metadataInformationPanelTab = useMemo(
    () => ({
      label: "Metadata Information",
      value: detailPageDefault.METADATA_INFORMATION,
      component: <MetadataInformationPanel />,
    }),
    []
  );

  const citationPanelTab = useMemo(
    () => ({
      label: "Citation",
      value: detailPageDefault.CITATION,
      component: <CitationPanel />,
    }),
    []
  );

  const associatedRecordsPanelTab = useMemo(
    () => ({
      label: "Associated Records",
      value: detailPageDefault.ASSOCIATED_RECORDS,
      component: <AssociatedRecordsPanel />,
    }),
    []
  );

  const TABS = useMemo(
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

  const pathname = location.pathname;
  const params = new URLSearchParams(location.search);
  const uuid = params.get("uuid");

  const [tabValue, setTabValue] = useState<number>(() => {
    const params = new URLSearchParams(location.search);

    const tabValue = params.get("tab");
    const index = TABS.findIndex((tab) => tab.value === tabValue);
    return index === -1 ? 0 : index;
  });

  const handleTabChange = useCallback(
    (newValue: number) => {
      // Update URL without navigating
      const newUrl = `${pathname}?uuid=${uuid}&tab=${TABS[newValue].value}`;
      window.history.pushState(null, "", newUrl);
    },
    [TABS, pathname, uuid]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabValue = params.get("tab");
    const index = TABS.findIndex((tab) => tab.value === tabValue);
    if (index !== -1) {
      setTabValue(index);
    }
  }, [TABS, location]);

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

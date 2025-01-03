import { FC, useCallback, useEffect, useMemo, useState } from "react";
import LinksPanel from "./tab-panels/LinksPanel";
import AboutPanel from "./tab-panels/AboutPanel";
import MetadataInformationPanel from "./tab-panels/MetadataInformationPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import AbstractAndDownloadPanel from "./tab-panels/AbstractAndDownloadPanel";
import LineagePanel from "./tab-panels/LineagePanel";
import AssociatedRecordsPanel from "./tab-panels/AssociatedRecordsPanel";
import { Card, Grid } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import { useDetailPageContext } from "../context/detail-page-context";
import RecordNotFoundPanel from "./tab-panels/RecordNotFoundPanel";
import TabsPanelContainer from "../../../components/common/tab/TabsPanelContainer";
import { useLocation } from "react-router-dom";
import { LngLatBounds } from "mapbox-gl";

interface ContentSectionProps {
  mapFocusArea?: LngLatBounds;
}

const ContentSection: FC<ContentSectionProps> = ({ mapFocusArea }) => {
  const abstractAndDownloadPanelTab = useMemo(
    () => ({
      label: "Abstract",
      value: "abstract",
      component: <AbstractAndDownloadPanel bbox={mapFocusArea} />,
    }),
    [mapFocusArea]
  );

  const aboutPanelTab = useMemo(
    () => ({ label: "About", value: "about", component: <AboutPanel /> }),
    []
  );

  const linksPanelTab = useMemo(
    () => ({
      label: "Links",
      value: "links",
      component: <LinksPanel />,
    }),
    []
  );

  const lineagePanelTab = useMemo(
    () => ({ label: "Lineage", value: "lineage", component: <LineagePanel /> }),
    []
  );

  const metadataInformationPanelTab = useMemo(
    () => ({
      label: "Metadata Information",
      value: "metadata information",
      component: <MetadataInformationPanel />,
    }),
    []
  );

  const citationPanelTab = useMemo(
    () => ({
      label: "Citation",
      value: "citation",
      component: <CitationPanel />,
    }),
    []
  );

  const associatedRecordsPanelTab = useMemo(
    () => ({
      label: "Associated Records",
      value: "associated records",
      component: <AssociatedRecordsPanel />,
    }),
    []
  );

  const TABS = useMemo(
    () => [
      abstractAndDownloadPanelTab,
      aboutPanelTab,
      linksPanelTab,
      lineagePanelTab,
      metadataInformationPanelTab,
      citationPanelTab,
      associatedRecordsPanelTab,
    ],
    [
      aboutPanelTab,
      abstractAndDownloadPanelTab,
      associatedRecordsPanelTab,
      citationPanelTab,
      lineagePanelTab,
      linksPanelTab,
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

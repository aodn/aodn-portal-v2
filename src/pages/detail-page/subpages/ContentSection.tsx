import LinksPanel from "./tab-panels/LinksPanel";
import AboutPanel from "./tab-panels/AboutPanel";
import MetadataInformationPanel from "./tab-panels/MetadataInformationPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import { FC, useEffect, useState } from "react";
import AbstractAndDownloadPanel from "./tab-panels/AbstractAndDownloadPanel";
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

export const TABS: Tab[] = [
  {
    label: "Abstract",
    value: "abstract",
    component: <AbstractAndDownloadPanel />,
  },
  { label: "About", value: "about", component: <AboutPanel /> },
  {
    label: "Links",
    value: "links",
    component: <LinksPanel />,
  },
  { label: "Lineage", value: "lineage", component: <LineagePanel /> },
  {
    label: "Metadata Information",
    value: "metadata information",
    component: <MetadataInformationPanel />,
  },
  { label: "Citation", value: "citation", component: <CitationPanel /> },
  {
    label: "Associated Records",
    value: "associated records",
    component: <AssociatedRecordsPanel />,
  },
  //TODO: hide it now, for better demonstration. Will be added back (or delete)
  // when have final decision on it
  // {
  //   label: "Global Attribute",
  //   value: "Global Attribute",
  //   component: <GlobalAttributePanel />,
  // },
];

const ContentSection: FC = () => {
  const location = useLocation();

  const { isCollectionNotFound } = useDetailPageContext();

  const [tabValue, setTabValue] = useState<number>(() => {
    const params = new URLSearchParams(location.search);

    const tabValue = params.get("tab");
    const index = TABS.findIndex((tab) => tab.value === tabValue);
    return index === -1 ? 0 : index;
  });

  const pathname = location.pathname;

  const params = new URLSearchParams(location.search);

  const uuid = params.get("uuid");

  const handleTabChange = (newValue: number) => {
    // Update URL without navigating
    const newUrl = `${pathname}?uuid=${uuid}&tab=${TABS[newValue].value}`;
    window.history.pushState(null, "", newUrl);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabValue = params.get("tab");
    const index = TABS.findIndex((tab) => tab.value === tabValue);
    if (index !== -1) {
      setTabValue(index);
    }
  }, [location]);

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

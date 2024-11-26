import LinksPanel from "./tab-panels/LinksPanel";
import AboutPanel from "./tab-panels/AboutPanel";
import MetadataInformationPanel from "./tab-panels/MetadataInformationPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import { FC } from "react";
import AbstractAndDownloadPanel from "./tab-panels/AbstractAndDownloadPanel";
import LineagePanel from "./tab-panels/LineagePanel";
import AssociatedRecordsPanel from "./tab-panels/AssociatedRecordsPanel";
import { Card, Grid } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import { useDetailPageContext } from "../context/detail-page-context";
import RecordNotFoundPanel from "./tab-panels/RecordNotFoundPanel";
import TabsPanelContainer, {
  Tab,
} from "../../../components/details/TabsPanelContainer";

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
  const { isCollectionNotFound } = useDetailPageContext();
  return (
    <Card
      sx={{
        backgroundColor: "white",
        borderRadius: borderRadius.small,
      }}
    >
      <TabsPanelContainer />

      {isCollectionNotFound && (
        <Grid container sx={{ height: "1000px" }}>
          <RecordNotFoundPanel />
        </Grid>
      )}
    </Card>
  );
};

export default ContentSection;

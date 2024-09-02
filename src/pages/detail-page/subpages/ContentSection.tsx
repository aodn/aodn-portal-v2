import LinksPanel from "./tab-panels/LinksPanel";
import AboutPanel from "./tab-panels/AboutPanel";
import MetadataInformationPanel from "./tab-panels/MetadataInformationPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import { FC } from "react";
import AbstractAndDownloadPanel from "./tab-panels/AbstractAndDownloadPanel";
import LineagePanel from "./tab-panels/LineagePanel";
import AssociatedRecordsPanel from "./tab-panels/AssociatedRecordsPanel";
import GlobalAttributePanel from "./tab-panels/GlobalAttributePanel";
import TabsPanelContainer from "../../../components/details/TabsPanelContainer";
import { Card } from "@mui/material";
import { borderRadius } from "../../../styles/constants";

const tabs = [
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
  {
    label: "Global Attribute",
    value: "Global Attribute",
    component: <GlobalAttributePanel />,
  },
];

const ContentSection: FC = () => {
  return (
    <Card
      sx={{
        backgroundColor: "white",
        borderRadius: borderRadius.small,
      }}
    >
      <TabsPanelContainer tabs={tabs} />
    </Card>
  );
};

export default ContentSection;

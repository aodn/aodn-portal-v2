import LinksPanel from "./tab-panels/LinksPanel";
import CardWithTabsPanel from "../../../components/details/TabsPanelContainer";
import AboutCard from "./tab-panels/AboutPanel";
import MetadataInformationCard from "./tab-panels/MetadataInformationPanel";
import CitationCard from "./tab-panels/CitationPanel";
import { FC } from "react";
import AbstractAndDownloadPanel from "./tab-panels/AbstractAndDownloadPanel";

const tabs = [
  {
    label: "Abstract",
    value: "abstract",
    component: <AbstractAndDownloadPanel />,
  },
  { label: "About", value: "about", component: <AboutCard /> },
  {
    label: "Metadata Information",
    value: "metadata information",
    component: <MetadataInformationCard />,
  },
  { label: "Citation", value: "citation", component: <CitationCard /> },
];

const ContentUpperSection: FC = () => {
  return (
    <>
      <CardWithTabsPanel tabs={tabs} />
    </>
  );
};

export default ContentUpperSection;

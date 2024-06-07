import AbstractCard from "./tab-panels/AbstractPanel";
import CardWithTabsPanel from "../../../components/details/TabsPanelContainer";
import AboutPanel from "./tab-panels/AboutPanel";
import MetadataInformationCard from "./tab-panels/MetadataInformationPanel";
import CitationCard from "./tab-panels/CitationPanel";
import { FC } from "react";

const tabs = [
  { label: "Abstract", value: "abstract", component: <AbstractCard /> },
  { label: "About", value: "about", component: <AboutPanel /> },
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

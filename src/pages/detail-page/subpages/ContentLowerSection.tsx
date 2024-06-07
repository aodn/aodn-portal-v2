import AbstractCard from "./tab-panels/AbstractPanel";
import CardWithTabsPanel from "../../../components/details/TabsPanelContainer";
import LinksAndDownloadsCard from "./tab-panels/LinksAndDownloadsPanel";
import LineageCard from "./tab-panels/LineagePanel";
import AssociatedRecordsCard from "./tab-panels/AssociatedRecordsPanel";
import GlobalAttributeCard from "./tab-panels/GlobalAttributePanel";

const tabs = [
  {
    label: "Links and Downloads",
    value: "links and downloads",
    component: <LinksAndDownloadsCard />,
  },
  { label: "Lineage", value: "lineage", component: <LineageCard /> },
  {
    label: "Associated Records",
    value: "associated records",
    component: <AssociatedRecordsCard />,
  },
  {
    label: "Global Attribute",
    value: "Global Attribute",
    component: <GlobalAttributeCard />,
  },
];

const ContentLowerSection = () => {
  return (
    <>
      <CardWithTabsPanel tabs={tabs} />
    </>
  );
};

export default ContentLowerSection;

import LinksPanel from "./tab-panels/LinksPanel";
import CardWithTabsPanel from "../../../components/details/TabsPanelContainer";
import LineageCard from "./tab-panels/LineagePanel";
import AssociatedRecordsCard from "./tab-panels/AssociatedRecordsPanel";
import GlobalAttributeCard from "./tab-panels/GlobalAttributePanel";

const tabs = [
  {
    label: "Links",
    value: "links",
    component: <LinksPanel />,
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

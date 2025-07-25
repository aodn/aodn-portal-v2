import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "All efforts have been taken to logically group the links found in the metadata record. If you believe an entry to incorrectly grouped please contact us at info@aodn.org.au",
};

interface OtherItemListProps {
  title?: string;
  otherLinks: ILink[];
  selected?: boolean;
}

const OtherItemList: React.FC<OtherItemListProps> = ({
  otherLinks,
  title,
  selected = false,
}) => {
  const otherItems = otherLinks?.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  return (
    <ExpandableList
      selected={selected}
      childrenList={otherItems}
      title={title}
      info={INFO_TIP_CONTENT}
    />
  );
};

export default OtherItemList;

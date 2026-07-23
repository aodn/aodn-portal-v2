import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./list-item/ItemBaseGrid";
import { ILink } from "@/app/store/OGCCollectionDefinitions";
import LinkCard from "./list-item/sub-item/LinkCard";

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "Links to other useful resources.",
};

interface OtherItemListProps {
  title?: string;
  otherLinks?: ILink[];
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

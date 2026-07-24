import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./list-item/ItemBaseGrid";
import LinkCard from "./list-item/sub-item/LinkCard";
import { ILink } from "@/app/api/ogcCollectionTypes";
import { IconLink } from "../icon/IconLink";

interface MetadataUrlListProps {
  url: string;
  selected?: boolean;
}

const MetadataUrlList: React.FC<MetadataUrlListProps> = ({
  url,
  selected = false,
}) => {
  const metadataLinkItem = (
    <ItemBaseGrid key={url}>
      <LinkCard
        link={
          {
            rel: "",
            href: url,
            title: url,
            type: "",
            description: "",
            getIcon: () => IconLink,
          } as ILink
        }
      />
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      selected={selected}
      title="Full Metadata Link"
      childrenList={url ? [metadataLinkItem] : []}
    />
  );
};

export default MetadataUrlList;

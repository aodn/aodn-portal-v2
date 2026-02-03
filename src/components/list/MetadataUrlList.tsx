import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import LinkCard from "./listItem/subitem/LinkCard";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import { IconLink } from "../../assets/icons/link";

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

import React from "react";
import { Link } from "@mui/material";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

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
      <Link href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </Link>
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

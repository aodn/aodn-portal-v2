import React from "react";
import { Link } from "@mui/material";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

interface MetadataUrlListProps {
  url: string;
}

const MetadataUrlList: React.FC<MetadataUrlListProps> = ({ url }) => {
  const metadataLinkItem = (
    <ItemBaseGrid key={url}>
      <Link href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </Link>
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      title="Full Metadata Link"
      childrenList={url ? [metadataLinkItem] : []}
    />
  );
};

export default MetadataUrlList;

import React, { ReactNode } from "react";
import { Link } from "@mui/material";
import TextItem from "./listItem/TextItem";
import ExpandableList from "./ExpandableList";

interface MetadataUrlListProps {
  url: string;
}

const MetadataUrlList: React.FC<MetadataUrlListProps> = ({ url }) => {
  const link: ReactNode[] = url
    ? [
        <TextItem key="url">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </Link>
        </TextItem>,
      ]
    : [];
  return <ExpandableList title="Full Metadata Link" childrenList={link} />;
};

export default MetadataUrlList;

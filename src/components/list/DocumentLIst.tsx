import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";

interface DocumentListProps {
  title: string;
  documentLinks?: ILink[];
  selected?: boolean;
}

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "References to documents available that provide supporting or related content.",
};

const DocumentList: React.FC<DocumentListProps> = ({
  documentLinks,
  title,
  selected = false,
}) => {
  const documentItems = documentLinks?.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  return (
    <ExpandableList
      selected={selected}
      childrenList={documentItems}
      title={title}
      info={INFO_TIP_CONTENT}
    />
  );
};

export default DocumentList;

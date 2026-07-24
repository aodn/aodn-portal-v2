import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./list-item/ItemBaseGrid";
import { ILink } from "@/app/api/ogcCollectionTypes";
import LinkCard from "./list-item/sub-item/LinkCard";

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

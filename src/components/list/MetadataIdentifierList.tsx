import React from "react";
import ExpandableList from "./ExpandableList";
import TextArea from "./listItem/subitem/TextArea";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

interface MetadataIdentifierListProps {
  identifier: string;
}

const MetadataIdentifierList: React.FC<MetadataIdentifierListProps> = ({
  identifier,
}) => {
  const metadataIdentiferItem = (
    <ItemBaseGrid container key={identifier}>
      <TextArea text={identifier} />
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      childrenList={identifier ? [metadataIdentiferItem] : []}
      title="Metadata Identifier"
    />
  );
};

export default MetadataIdentifierList;

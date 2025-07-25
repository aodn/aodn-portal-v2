import React from "react";
import ExpandableList from "./ExpandableList";
import TextArea from "./listItem/subitem/TextArea";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

interface MetadataIdentifierListProps {
  identifier: string;
  selected?: boolean;
}

const MetadataIdentifierList: React.FC<MetadataIdentifierListProps> = ({
  identifier,
  selected = false,
}) => {
  const metadataIdentiferItem = (
    <ItemBaseGrid container key={identifier}>
      <TextArea text={identifier} />
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      selected={selected}
      childrenList={identifier ? [metadataIdentiferItem] : []}
      title="Metadata Identifier"
    />
  );
};

export default MetadataIdentifierList;

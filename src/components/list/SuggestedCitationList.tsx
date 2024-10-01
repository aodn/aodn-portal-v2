import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";

interface SuggestedCitationListProps {
  suggestedCitation: string;
}

const SuggestedCitationList: React.FC<SuggestedCitationListProps> = ({
  suggestedCitation,
}) => {
  const suggestedCitationItem = suggestedCitation ? (
    <ItemBaseGrid key={suggestedCitation}>
      <ExpandableTextArea text={suggestedCitation} />
    </ItemBaseGrid>
  ) : null;

  return (
    <ExpandableList
      title="Suggested Citation"
      childrenList={suggestedCitation ? [suggestedCitationItem] : []}
    />
  );
};

export default SuggestedCitationList;

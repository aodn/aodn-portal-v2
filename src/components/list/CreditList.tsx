import React from "react";
import ExpandableList from "./ExpandableList";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

interface CreditListProps {
  credits: string[];
  selected?: boolean;
}

const CreditList: React.FC<CreditListProps> = ({
  credits,
  selected = false,
}) => {
  const creditItems = credits.map((credit, index) => (
    <ItemBaseGrid key={index}>
      <ExpandableTextArea
        text={credit}
        lineClampConfig={{ default: 4, mobile: 3, tablet: 3 }}
      />
    </ItemBaseGrid>
  ));

  return (
    <ExpandableList
      selected={selected}
      childrenList={creditItems}
      title="Credits"
    />
  );
};

export default CreditList;

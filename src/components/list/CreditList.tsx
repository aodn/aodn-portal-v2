import React from "react";
import ExpandableList from "./ExpandableList";
import ExpandableTextArea from "./list-item/sub-item/ExpandableTextArea";
import ItemBaseGrid from "./list-item/ItemBaseGrid";

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

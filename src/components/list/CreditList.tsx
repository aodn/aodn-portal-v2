import React from "react";
import ExpandableList from "./ExpandableList";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

interface CreditListProps {
  credits: string[];
}

const CreditList: React.FC<CreditListProps> = ({ credits }) => {
  const creditItems = credits.map((credit, index) => (
    <ItemBaseGrid key={index}>
      <ExpandableTextArea text={credit} />
    </ItemBaseGrid>
  ));

  return <ExpandableList childrenList={creditItems} title="Credits" />;
};

export default CreditList;
import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import TextArea from "./listItem/subitem/TextArea";

interface StatementListProps {
  statement: string;
}

const StatementList: React.FC<StatementListProps> = ({ statement }) => {
  const statementItem = (
    <ItemBaseGrid container key={statement}>
      <TextArea text={statement} />
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      childrenList={statement ? [statementItem] : []}
      title="Statement"
    />
  );
};

export default StatementList;

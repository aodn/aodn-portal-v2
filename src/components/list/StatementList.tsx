import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import TextArea from "./listItem/subitem/TextArea";

interface StatementListProps {
  title?: string;
  statement: string;
}

const StatementList: React.FC<StatementListProps> = ({ title, statement }) => {
  const statementItem = (
    <ItemBaseGrid container key={statement}>
      <TextArea text={statement} />
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      childrenList={statement ? [statementItem] : []}
      title={title}
    />
  );
};

export default StatementList;

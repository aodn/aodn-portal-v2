import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import TextArea from "./listItem/subitem/TextArea";

interface StatementListProps {
  title?: string;
  statement: string;
  selected?: boolean;
}

const StatementList: React.FC<StatementListProps> = ({
  title,
  statement,
  selected = false,
}) => {
  const statementItem = (
    <ItemBaseGrid container key={statement}>
      <TextArea text={statement} />
    </ItemBaseGrid>
  );

  return (
    <ExpandableList
      selected={selected}
      childrenList={statement ? [statementItem] : []}
      title={title}
    />
  );
};

export default StatementList;

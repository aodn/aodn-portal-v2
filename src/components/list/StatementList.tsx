import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";

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
      <ExpandableTextArea text={statement} />
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

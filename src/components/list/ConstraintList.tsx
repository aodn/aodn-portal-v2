import React from "react";
import CollapseItem from "./listItem/CollapseItem";
import ExpandableList from "./ExpandableList";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";

interface ConstraintListProps {
  constraints: { title: string; content: string[] }[];
  selected?: boolean;
}

const ConstraintList: React.FC<ConstraintListProps> = ({
  constraints,
  selected = false,
}) => {
  const generateConstraintCollaseItem = (
    constraint: {
      title: string;
      content: string[];
    },
    index: number
  ) => {
    return (
      <CollapseItem title={constraint.title} isOpen key={index}>
        {constraint.content.map((line, index) => (
          <ExpandableTextArea text={line} key={index} />
        ))}
      </CollapseItem>
    );
  };

  const constraintItems = constraints.map((constraint, index) =>
    generateConstraintCollaseItem(constraint, index)
  );

  return (
    <ExpandableList
      selected={selected}
      childrenList={constraintItems}
      title={"Constraints"}
    />
  );
};

export default ConstraintList;

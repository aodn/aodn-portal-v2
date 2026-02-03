import React from "react";
import CollapseItem from "./listItem/CollapseItem";
import ExpandableList from "./ExpandableList";
import TextArea from "./listItem/subitem/TextArea";

interface ConstraintListProps {
  constraints: { title: string; content: string[] }[];
  selected?: boolean;
}

const ConstraintList: React.FC<ConstraintListProps> = ({
  constraints,
  selected = false,
}) => {
  const generateConstraintCollapseItem = (
    constraint: {
      title: string;
      content: string[];
    },
    index: number
  ) => {
    return (
      <CollapseItem title={constraint.title} isOpen key={index}>
        {constraint.content.map((line, index) => (
          <TextArea
            text={line}
            key={index}
            isCopyable
            showCopyOnHover={false}
          />
        ))}
      </CollapseItem>
    );
  };

  const constraintItems = constraints.map((constraint, index) =>
    generateConstraintCollapseItem(constraint, index)
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

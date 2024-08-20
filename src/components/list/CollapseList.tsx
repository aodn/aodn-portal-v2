import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import CollapseItem from "./listItem/CollapseItem";
import TextArea from "./listItem/subitem/TextArea";

interface CollapseListProps {
  title: string;
  items: { title: string; content: string[] }[];
  areAllOpen?: boolean;
}

const CollapseList: React.FC<CollapseListProps> = ({
  title,
  items,
  areAllOpen = false,
}) => {
  // children list
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    items?.map((item, index) => {
      returnedList.push(
        <CollapseItem title={item.title} key={index} isOpen={areAllOpen}>
          {item.content?.map((content, index) => (
            <TextArea key={index}>{content}</TextArea>
          ))}
        </CollapseItem>
      );
    });
    return returnedList;
  }, [areAllOpen, items]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default CollapseList;

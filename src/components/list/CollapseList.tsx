import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import CollapseItem from "./listItem/CollapseItem";
import TextArea from "./listItem/subitem/TextArea";

interface CollapseListProps {
  title: string;
  items: { title: string; content: string[] }[];
}

const CollapseList: React.FC<CollapseListProps> = ({ title, items }) => {
  // children list
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    items?.map((item, index) => {
      returnedList.push(
        <CollapseItem title={item.title} key={index}>
          {item.content?.map((content, index) => {
            return <TextArea key={index}>{content}</TextArea>;
          })}
        </CollapseItem>
      );
    });
    return returnedList;
  }, [items]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default CollapseList;

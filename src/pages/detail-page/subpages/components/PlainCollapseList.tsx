import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import CollapseFrame from "./CollapseFrame";
import PlainTextItem from "./PlainTextItem";

interface PlainCollapseListProps {
  title: string;
  items: { title: string; content: string[] }[];
}

const PlainCollapseList: React.FC<PlainCollapseListProps> = ({
  title,
  items,
}) => {
  // children list
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    items?.map((item, index) => {
      returnedList.push(
        <CollapseFrame title={item.title} key={index}>
          {item.content?.map((content, index) => {
            return <PlainTextItem key={index}>{content}</PlainTextItem>;
          })}
        </CollapseFrame>
      );
    });
    return returnedList;
  }, [items]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default PlainCollapseList;

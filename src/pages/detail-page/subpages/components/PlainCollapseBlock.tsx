import React, { ReactNode, useMemo } from "react";
import BlockList from "./BlockList";
import CollapseFrame from "./CollapseFrame";
import PlainTextFragment from "./PlainTextFragment";

interface KeywordSectionProps {
  title: string;
  items: { title: string; content: string[] }[];
}

const PlainCollapseBlock: React.FC<KeywordSectionProps> = ({
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
            return <PlainTextFragment key={index}>{content}</PlainTextFragment>;
          })}
        </CollapseFrame>
      );
    });
    return returnedList;
  }, [items]);

  return <BlockList title={title} childrenList={collapseComponents} />;
};

export default PlainCollapseBlock;
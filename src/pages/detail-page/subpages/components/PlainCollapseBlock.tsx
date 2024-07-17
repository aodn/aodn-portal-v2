import React, { ReactNode, useMemo } from "react";
import BlockList from "./BlockList";
import CollapseFrame from "./CollapseFrame";
import { Typography } from "@mui/material";

interface KeywordSectionProps {
  items: { title: string; content: string[] }[];
}

const PlainCollapseBlock: React.FC<KeywordSectionProps> = ({ items }) => {
  // children list
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    items?.map((item, index) => {
      returnedList.push(
        <CollapseFrame title={item.title} key={index}>
          {item.content?.map((content, index) => {
            return (
              <Typography variant="body1" key={index}>
                {content}
              </Typography>
            );
          })}
        </CollapseFrame>
      );
    });
    return returnedList;
  }, [items]);

  return <BlockList title="Keywords" childrenList={collapseComponents} />;
};

export default PlainCollapseBlock;

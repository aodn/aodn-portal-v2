import React, { ReactNode, useMemo } from "react";
import { ITheme } from "../../../../types/DataStructureTypes";
import BlockList from "./BlockList";
import CollapseFrame from "./CollapseFrame";
import BulletedText from "../../../../components/common/texts/BulletedText";

interface KeywordSectionProps {
  themes: ITheme[];
}

const KeywordBlock: React.FC<KeywordSectionProps> = ({ themes }) => {
  // children list
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    themes?.map((theme, index) => {
      returnedList.push(
        <CollapseFrame title={theme.title} key={index}>
          {theme.concepts?.map((concept, index) => {
            return <BulletedText key={index}>{concept.id}</BulletedText>;
          })}
        </CollapseFrame>
      );
    });
    return returnedList;
  }, [themes]);

  return <BlockList title="Keywords" childrenList={collapseComponents} />;
};

export default KeywordBlock;

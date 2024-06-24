import React, { ReactNode, useMemo } from "react";
import { ITheme } from "../../../../types/DataStructureTypes";
import ListSection from "./ListSection";
import CollapseFrame from "./CollapseFrame";
import BulletedText from "../../../../components/common/texts/BulletedText";

interface KeywordSectionProps {
  themes: ITheme[];
}

const KeywordSection: React.FC<KeywordSectionProps> = ({ themes }) => {
  // children list
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    themes?.map((theme) => {
      returnedList.push(
        <CollapseFrame title={theme.title} key={theme.title}>
          {theme.concepts?.map((concept, index) => {
            return <BulletedText key={index}>{concept.id}</BulletedText>;
          })}
        </CollapseFrame>
      );
    });
    return returnedList;
  }, [themes]);

  return <ListSection title="Keywords" childrenList={collapseComponents} />;
};

export default KeywordSection;

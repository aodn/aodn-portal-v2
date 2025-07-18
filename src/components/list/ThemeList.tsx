import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import TextArea from "./listItem/subitem/TextArea";
import NaList from "./NaList";

interface ThemeListProps {
  title: string;
  themes: string[];
}

const ThemeList: React.FC<ThemeListProps> = ({ title, themes }) => {
  const statementItem = useMemo(
    () => (
      <ItemBaseGrid container key={"theme-list-container-key"}>
        {themes.length !== 0 ? (
          themes.map((theme: string) => {
            return <TextArea key={theme} text={theme} />;
          })
        ) : (
          <NaList title={title}></NaList>
        )}
      </ItemBaseGrid>
    ),
    [themes, title]
  );

  return <ExpandableList childrenList={[statementItem]} title={title} />;
};

export default ThemeList;

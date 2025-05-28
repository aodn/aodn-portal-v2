import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import TextArea from "./listItem/subitem/TextArea";
import { ITheme } from "../common/store/OGCCollectionDefinitions";
import NaList from "./NaList";

interface ThemeListProps {
  title: string;
  themes: ITheme[];
}

const ThemeList: React.FC<ThemeListProps> = ({ title, themes = [] }) => {
  const statementItem = useMemo(
    () => (
      <ItemBaseGrid container key={"theme-list-container-key"}>
        {themes.length !== 0 ? (
          themes.map((theme: ITheme) => (
            <TextArea key={theme.title} text={theme.title} />
          ))
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

import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import TextArea from "./listItem/subitem/TextArea";
import NaList from "./NaList";
import { borderRadius, gap } from "../../styles/constants";
import { useTheme } from "@mui/material";

interface ThemeListProps {
  title: string;
  themes: string[];
  selected?: boolean;
}

const ThemeList: React.FC<ThemeListProps> = ({
  title,
  themes,
  selected = false,
}) => {
  const theme = useTheme();

  const statementItem = useMemo(
    () => (
      <ItemBaseGrid
        container
        direction="row"
        key={"theme-list-container-key"}
        gap={1.25}
      >
        {themes.length !== 0 ? (
          themes.map((item: string) => {
            return (
              <TextArea
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                  backgroundColor: theme.palette.common.white,
                  padding: "8px 14px",
                  my: "4px",
                  gap: gap.xlg,
                  borderRadius: borderRadius.small,
                }}
                key={item}
                text={item}
              />
            );
          })
        ) : (
          <NaList title={title}></NaList>
        )}
      </ItemBaseGrid>
    ),
    [theme.palette.common.white, themes, title]
  );

  return (
    <ExpandableList
      selected={selected}
      childrenList={[statementItem]}
      title={title}
    />
  );
};

export default ThemeList;

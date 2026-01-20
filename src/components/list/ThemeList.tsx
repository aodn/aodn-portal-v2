import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import NaList from "./NaList";
import { useTheme } from "@mui/material";
import LabelChip from "../common/label/LabelChip";

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
          <LabelChip
            text={themes}
            sx={{
              padding: "8px 14px",
            }}
          />
        ) : (
          <NaList title={title}></NaList>
        )}
      </ItemBaseGrid>
    ),
    [themes, title]
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

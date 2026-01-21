import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import NaList from "./NaList";
import LabelChip from "../common/label/LabelChip";
import { addSpacesToCamelCase } from "../../utils/FormatUtils";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

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
  const updatedThemes = themes.map((theme) =>
    addSpacesToCamelCase(capitalizeFirstLetter(theme, false))
  );
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
            text={updatedThemes}
            sx={{
              padding: "8px 14px",
            }}
          />
        ) : (
          <NaList title={title}></NaList>
        )}
      </ItemBaseGrid>
    ),
    [themes.length, title, updatedThemes]
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

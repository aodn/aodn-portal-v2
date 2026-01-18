import React from "react";
import { IKeyword } from "../common/store/OGCCollectionDefinitions";
import CollapseItem from "./listItem/CollapseItem";
import TextArea from "./listItem/subitem/TextArea";
import ExpandableList from "./ExpandableList";

interface KeywordListProps {
  keywords: IKeyword[];
  selected?: boolean;
}

const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
  selected = false,
}) => {
  const generateKeywordCollapseItem = (keyword: IKeyword, index: number) => {
    return (
      <CollapseItem
        title={keyword.title}
        key={index}
        labels={[keyword.description]}
      >
        {keyword.content && keyword.content.length > 0
          ? keyword.content.map((line, index) => (
              <TextArea text={line} key={index} sx={{ pb: "10px" }} />
            ))
          : "[ NO CONTENT ]"}
      </CollapseItem>
    );
  };

  const keywordItems = keywords.map((keyword, index) =>
    generateKeywordCollapseItem(keyword, index)
  );

  return (
    <ExpandableList
      selected={selected}
      childrenList={keywordItems}
      title={"Keywords"}
    />
  );
};

export default KeywordList;

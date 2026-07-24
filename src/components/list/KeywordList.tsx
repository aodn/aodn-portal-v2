import React from "react";
import { IKeyword } from "@/app/api/ogcCollectionTypes";
import CollapseItem from "./list-item/CollapseItem";
import TextArea from "./list-item/sub-item/TextArea";
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

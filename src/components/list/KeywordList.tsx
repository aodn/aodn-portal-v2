import React from "react";
import { IKeyword } from "../common/store/OGCCollectionDefinitions";
import CollapseItem from "./listItem/CollapseItem";
import TextArea from "./listItem/subitem/TextArea";
import ExpandableList from "./ExpandableList";

interface KeywordListProps {
  keywords: IKeyword[];
}

const KeywordList: React.FC<KeywordListProps> = ({ keywords }) => {
  const generateKeywordCollaseItem = (keyword: IKeyword, index: number) => {
    return (
      <CollapseItem title={keyword.title} key={index}>
        {keyword.content && keyword.content.length > 0
          ? keyword.content.map((line, index) => (
              <TextArea text={line} key={index} />
            ))
          : "[ NO CONTENT ]"}
      </CollapseItem>
    );
  };

  const keywordItems = keywords.map((keyword, index) =>
    generateKeywordCollaseItem(keyword, index)
  );

  return <ExpandableList childrenList={keywordItems} title={"Keywords"} />;
};

export default KeywordList;

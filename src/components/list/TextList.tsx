import ExpandableList from "./ExpandableList";
import React, { ReactNode, useMemo } from "react";
import TextItem from "./listItem/TextItem";

interface TextListProps {
  title: string;
  texts: string[];
}
const TextList: React.FC<TextListProps> = ({ title, texts }) => {
  const textComponents: ReactNode[] = useMemo(() => {
    const textsToAdd: ReactNode[] = [];
    texts?.map((text) => {
      const displayingText = [];

      // implement new line if contains \n
      if (text.includes("\n")) {
        const splitedText = text.split("\n");
        splitedText.forEach((textPart, index) => {
          if (index > 0) {
            displayingText.push(<br key={index} />);
          }
          displayingText.push(textPart);
        });
      } else {
        displayingText.push(text);
      }

      textsToAdd.push(<TextItem key={text}>{displayingText}</TextItem>);
    });
    return textsToAdd;
  }, [texts]);
  return <ExpandableList title={title} childrenList={textComponents} />;
};
export default TextList;

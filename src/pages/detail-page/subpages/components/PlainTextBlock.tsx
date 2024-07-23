import BlockList from "./BlockList";
import React, { ReactNode, useMemo } from "react";
import PlainTextFragment from "./PlainTextFragment";

interface PlainTextBlockProps {
  title: string;
  texts: string[];
}
const PlainTextBlock: React.FC<PlainTextBlockProps> = ({ title, texts }) => {
  const plainTextFragments: ReactNode[] = useMemo(() => {
    const textFragmentList: ReactNode[] = [];
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

      textFragmentList.push(
        <PlainTextFragment key={text}>{displayingText}</PlainTextFragment>
      );
    });
    return textFragmentList;
  }, [texts]);
  return <BlockList title={title} childrenList={plainTextFragments} />;
};
export default PlainTextBlock;

import BlockList from "./BlockList";
import React, { ReactNode, useMemo } from "react";
import PlainTextFragment from "./PlainTextFragmentProps";

interface PlainTextBlockProps {
  title: string;
  texts: string[];
}
const PlainTextBlock: React.FC<PlainTextBlockProps> = ({ title, texts }) => {
  const textList: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    texts?.map((text) => {
      const showedText = [];

      // implement new line if contains \n
      if (text.includes("\n")) {
        const splitText = text.split("\n");
        splitText.forEach((textPart, index) => {
          if (index > 0) {
            showedText.push(<br />);
          }
          showedText.push(textPart);
        });
      } else {
        showedText.push(text);
      }

      returnedList.push(
        <PlainTextFragment key={text}>{showedText}</PlainTextFragment>
      );
    });
    return returnedList;
  }, [texts]);
  return <BlockList title={title} childrenList={textList} />;
};
export default PlainTextBlock;

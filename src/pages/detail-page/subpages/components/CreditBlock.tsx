import BlockList from "./BlockList";
import React, { ReactNode, useMemo } from "react";
import PlainTextFragment from "./PlainTextFragment";

interface CreditBlockProps {
  credits: string[];
}
const CreditBlock: React.FC<CreditBlockProps> = ({ credits }) => {
  const creditList: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    credits?.map((credit) => {
      returnedList.push(
        <PlainTextFragment key={credit}>{credit}</PlainTextFragment>
      );
    });
    return returnedList;
  }, [credits]);
  return <BlockList title="Credit" childrenList={creditList} />;
};
export default CreditBlock;

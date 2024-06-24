import ListSection from "./ListSection";
import React, { ReactNode, useMemo } from "react";
import PlainTextFragment from "./PlainTextFragment";

interface CreditSectionProps {
  credits: string[];
}
const CreditSection: React.FC<CreditSectionProps> = ({ credits }) => {
  const creditList: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    credits?.map((credit) => {
      returnedList.push(
        <PlainTextFragment key={credit}>{credit}</PlainTextFragment>
      );
    });
    return returnedList;
  }, [credits]);
  return <ListSection title="Credit" childrenList={creditList} />;
};
export default CreditSection;

import React from "react";
import StyledNaItemGrid from "./StyledNaItemGrid";
import NaArea from "./subitem/NaArea";

interface NaItemProps {
  title: string;
}

const NaItem: React.FC<NaItemProps> = ({ title }) => {
  return (
    <StyledNaItemGrid container>
      <NaArea title={title} />
    </StyledNaItemGrid>
  );
};

export default NaItem;

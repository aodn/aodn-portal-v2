import React from "react";
import StyledItemGrid from "./StyledItemGrid";
import TextArea from "./subitem/TextArea";

interface TextItemProps {
  children: React.ReactNode;
}

const TextItem: React.FC<TextItemProps> = ({ children }) => {
  return (
    <StyledItemGrid container>
      <TextArea>{children}</TextArea>
    </StyledItemGrid>
  );
};
export default TextItem;

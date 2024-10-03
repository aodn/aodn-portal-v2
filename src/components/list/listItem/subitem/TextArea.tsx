import React from "react";
import { Typography } from "@mui/material";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { decodeHtmlEntities } from "../../../../utils/StringUtils";

interface TextAreaProps {
  text: string;
}

const TextArea: React.FC<TextAreaProps> = ({ text }) => {
  return (
    <TextAreaBaseGrid>
      <Typography variant="detailContent">
        {decodeHtmlEntities(text)}
      </Typography>
    </TextAreaBaseGrid>
  );
};

export default TextArea;

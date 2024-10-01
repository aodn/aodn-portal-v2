import React from "react";
import { Typography } from "@mui/material";
import TextAreaBaseGrid from "./TextAreaBaseGrid";

interface TextAreaProps {
  text: string;
}

const TextArea: React.FC<TextAreaProps> = ({ text }) => {
  return (
    <TextAreaBaseGrid>
      <Typography variant="detailContent">{text}</Typography>
    </TextAreaBaseGrid>
  );
};

export default TextArea;

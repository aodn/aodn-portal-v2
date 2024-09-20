import React from "react";
import { Typography } from "@mui/material";
import TextAreaGrid from "./TextAreaGrid";

interface TextAreaProps {
  text: string;
}

const TextArea: React.FC<TextAreaProps> = ({ text }) => {
  return (
    <TextAreaGrid>
      <Typography variant="detailContent">{text}</Typography>
    </TextAreaGrid>
  );
};

export default TextArea;

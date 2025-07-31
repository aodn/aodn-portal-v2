import React from "react";
import { SxProps, Theme, Typography } from "@mui/material";
import { decodeHtmlEntities } from "../../../../utils/StringUtils";
import TextAreaBaseGrid from "./TextAreaBaseGrid";

interface TextAreaProps {
  text: string;
  sx?: SxProps<Theme>;
}

const TextArea: React.FC<TextAreaProps> = ({ text, sx }: TextAreaProps) => {
  return (
    <TextAreaBaseGrid sx={sx}>
      <Typography variant="detailContent">
        {decodeHtmlEntities(text)}
      </Typography>
    </TextAreaBaseGrid>
  );
};

export default TextArea;

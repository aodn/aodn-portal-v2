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
      <Typography
        component="span"
        variant="body2Regular"
        sx={{
          wordBreak: "break-word",
        }}
      >
        {decodeHtmlEntities(text)}
      </Typography>
    </TextAreaBaseGrid>
  );
};

export default TextArea;

import React from "react";
import { SxProps, Theme, Typography } from "@mui/material";
import { decodeHtmlEntities } from "../../../../utils/StringUtils";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import rc8Theme from "../../../../styles/themeRC8";

interface TextAreaProps {
  text: string;
  sx?: SxProps<Theme>;
}

const TextArea: React.FC<TextAreaProps> = ({ text, sx }: TextAreaProps) => {
  return (
    <TextAreaBaseGrid sx={sx}>
      <Typography
        component="span"
        sx={{
          ...rc8Theme.typography.body2Regular,
          wordBreak: "break-word",
          p: 0,
        }}
      >
        {decodeHtmlEntities(text)}
      </Typography>
    </TextAreaBaseGrid>
  );
};

export default TextArea;

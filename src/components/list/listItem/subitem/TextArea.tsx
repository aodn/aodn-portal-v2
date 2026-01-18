import React, { useMemo, useState } from "react";
import { SxProps, Theme, Typography } from "@mui/material";
import { useClipboardContext } from "../../../../context/clipboard/ClipboardContext";
import { decodeHtmlEntities } from "../../../../utils/StringUtils";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { portalTheme } from "../../../../styles";
import CopyButton, {
  CopyButtonConfig,
} from "../../../common/buttons/CopyButton";

interface TextAreaProps extends CopyButtonConfig {
  text: string;
  isCopyable?: boolean;
  showCopyOnHover?: boolean;
  sx?: SxProps<Theme>;
}

const TextArea: React.FC<TextAreaProps> = ({
  text,
  isCopyable = false,
  showCopyOnHover = true,
  copyButtonConfig,
  sx,
}: TextAreaProps) => {
  const { checkIsCopied } = useClipboardContext();
  const [hoverOnContent, setHoverOnContent] = useState<boolean>(false);

  const isVisibleCopyButton = useMemo(() => {
    const isCopied = checkIsCopied(text);
    if (showCopyOnHover) {
      return isCopied || hoverOnContent;
    } else {
      return true;
    }
  }, [checkIsCopied, hoverOnContent, showCopyOnHover, text]);

  return (
    <TextAreaBaseGrid
      sx={sx}
      onMouseEnter={() => setHoverOnContent(true)}
      onMouseLeave={() => setHoverOnContent(false)}
    >
      <Typography
        component="span"
        sx={{
          ...portalTheme.typography.body2Regular,
          wordBreak: "break-word",
          p: 0,
          display: "inline",
        }}
      >
        {decodeHtmlEntities(text)}
      </Typography>
      {isCopyable && (
        <CopyButton
          visible={isVisibleCopyButton}
          copyText={text}
          copyButtonConfig={copyButtonConfig}
        />
      )}
    </TextAreaBaseGrid>
  );
};

export default TextArea;

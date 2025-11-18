import React, { useCallback, useMemo, useState } from "react";
import { SxProps, Theme, Typography } from "@mui/material";
import { decodeHtmlEntities } from "../../../../utils/StringUtils";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import rc8Theme from "../../../../styles/themeRC8";
import CopyButton, {
  CopyButtonBasic,
} from "../../../common/buttons/CopyButton";
import useClipboard from "../../../../hooks/useClipboard";

interface TextAreaProps {
  text: string;
  isCopyable?: boolean;
  showCopyOnHover?: boolean;
  copyButtonConfig?: CopyButtonBasic;
  sx?: SxProps<Theme>;
}

const TextArea: React.FC<TextAreaProps> = ({
  text,
  isCopyable = false,
  showCopyOnHover = true,
  copyButtonConfig,
  sx,
}: TextAreaProps) => {
  const [hoverOnContent, setHoverOnContent] = useState<boolean>(false);
  const { checkIsCopied, copyToClipboard } = useClipboard();

  const onCopyButtonClick = useCallback(async () => {
    if (!isCopyable) return;
    if (copyButtonConfig?.copyToClipboard) {
      await copyButtonConfig.copyToClipboard(text);
    } else {
      await copyToClipboard(text);
    }
  }, [copyButtonConfig, copyToClipboard, isCopyable, text]);

  const isCopied = useMemo(() => {
    if (copyButtonConfig?.checkIsCopied) {
      return copyButtonConfig.checkIsCopied(text);
    } else {
      return checkIsCopied(text);
    }
  }, [checkIsCopied, copyButtonConfig, text]);

  const isVisibleCopyButton = useMemo(() => {
    if (showCopyOnHover) {
      return isCopied || hoverOnContent;
    } else {
      return true;
    }
  }, [hoverOnContent, isCopied, showCopyOnHover]);

  return (
    <TextAreaBaseGrid
      sx={sx}
      onMouseEnter={() => setHoverOnContent(true)}
      onMouseLeave={() => setHoverOnContent(false)}
    >
      <Typography
        component="span"
        sx={{
          ...rc8Theme.typography.body2Regular,
          wordBreak: "break-word",
          p: 0,
          display: "inline",
        }}
      >
        {decodeHtmlEntities(text)}
      </Typography>
      {isCopyable && (
        <CopyButton
          handleCopy={onCopyButtonClick}
          isCopied={isCopied}
          visible={isVisibleCopyButton}
          copyText={text}
          tooltipText={copyButtonConfig?.tooltipText}
          copyIconConfig={copyButtonConfig?.copyIconConfig}
        />
      )}
    </TextAreaBaseGrid>
  );
};

export default TextArea;

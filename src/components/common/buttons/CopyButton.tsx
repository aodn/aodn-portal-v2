import { FC, ReactNode, useCallback, useMemo } from "react";
import { Box, IconButton, SxProps, Tooltip } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import { ContentCopyIcon } from "../../../assets/icons/download/contentCopy";
import { portalTheme } from "../../../styles";
import { useClipboardContext } from "../../../context/clipboard/ClipboardContext";

interface CopyIconConfig {
  iconBeforeCopy?: ReactNode;
  iconAfterCopy?: ReactNode;
}

// TODO: change to SVG as per design if needed
const COPY_ICON_CONFIG_DEFAULT: CopyIconConfig = {
  iconBeforeCopy: (
    <ContentCopyIcon
      height={16}
      width={16}
      color={portalTheme.palette.primary1}
    />
  ),
  iconAfterCopy: (
    <DoneAllIcon
      sx={{ fontSize: "16px", color: portalTheme.palette.primary1 }}
    />
  ),
};

export interface CopyButtonConfig {
  copyButtonConfig?: CopyButtonBasic;
}

interface CopyButtonBasic {
  onCopy?: (value?: any) => void;
  copyIconConfig?: CopyIconConfig;
  tooltipText?: string[];
}

interface CopyButtonProps extends CopyButtonConfig {
  copyText: string;
  visible?: boolean;
  referenceId?: string;
  copyButtonConfig?: CopyButtonBasic;
  sx?: SxProps;
}

const CopyButton: FC<CopyButtonProps> = ({
  visible = true,
  copyText = "",
  referenceId = "",
  copyButtonConfig,
  sx,
}) => {
  const { copyToClipboard, checkIsCopied } = useClipboardContext();

  const onClick = useCallback(async () => {
    await copyToClipboard(copyText, referenceId);
    copyButtonConfig?.onCopy?.();
  }, [copyButtonConfig, copyText, copyToClipboard, referenceId]);

  const isCopied = useMemo(
    () => checkIsCopied(copyText, referenceId),
    [checkIsCopied, copyText, referenceId]
  );

  const { iconBeforeCopy, iconAfterCopy } = mergeWithDefaults(
    COPY_ICON_CONFIG_DEFAULT,
    copyButtonConfig?.copyIconConfig || {}
  );

  if (!visible) return null;

  return (
    <Box component="span" sx={{ display: "inline-block", ...sx }}>
      <Tooltip
        title={
          isCopied
            ? (copyButtonConfig?.tooltipText?.[1] ?? "Copied")
            : (copyButtonConfig?.tooltipText?.[0] ?? "Copy")
        }
        placement="top"
      >
        <IconButton
          data-testid={`copy-button-${copyText}`}
          onClick={(e) => {
            onClick();
            e.stopPropagation();
          }}
          sx={{
            padding: 0,
            pl: "0.2em",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          {isCopied ? iconAfterCopy : iconBeforeCopy}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CopyButton;

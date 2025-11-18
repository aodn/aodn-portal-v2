import { FC, ReactNode } from "react";
import { Box, IconButton, SxProps, Tooltip } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import { ContentCopyIcon } from "../../../assets/icons/download/contentCopy";
import rc8Theme from "../../../styles/themeRC8";

interface CopyIconConfig {
  iconBeforeCopy?: ReactNode;
  iconAfterCopy?: ReactNode;
}

// TODO: change to SVG as per design if needed
const COPY_ICON_CONFIG_DEFAULT: CopyIconConfig = {
  iconBeforeCopy: (
    <ContentCopyIcon height={16} width={16} color={rc8Theme.palette.primary1} />
  ),
  iconAfterCopy: (
    <DoneAllIcon sx={{ fontSize: "16px", color: rc8Theme.palette.primary1 }} />
  ),
};

export interface CopyButtonConfig {
  copyButtonConfig?: CopyButtonBasic;
}

export interface CopyButtonBasic {
  copyToClipboard?: (text: string, referenceId?: string) => Promise<void>;
  checkIsCopied?: (text: string, referenceId?: string | undefined) => boolean;
  copyIconConfig?: CopyIconConfig;
  tooltipText?: string[];
}

interface CopyButtonProps {
  handleCopy: () => void;
  isCopied?: boolean;
  visible?: boolean;
  copyText?: string;
  tooltipText?: string[];
  copyIconConfig?: CopyIconConfig;
  sx?: SxProps;
}

const CopyButton: FC<CopyButtonProps> = ({
  handleCopy,
  isCopied = false,
  copyText,
  tooltipText = [],
  visible = true,
  copyIconConfig,
  sx,
}) => {
  const { iconBeforeCopy, iconAfterCopy } = mergeWithDefaults(
    COPY_ICON_CONFIG_DEFAULT,
    copyIconConfig
  );

  if (!visible) return null;

  return (
    <Box component="span" sx={{ display: "inline-block", ...sx }}>
      <Tooltip
        title={
          isCopied ? (tooltipText[1] ?? "Copied") : (tooltipText[0] ?? "Copy")
        }
        placement="top"
      >
        <IconButton
          data-testid={`copy-button-${copyText}`}
          onClick={(e) => {
            handleCopy();
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

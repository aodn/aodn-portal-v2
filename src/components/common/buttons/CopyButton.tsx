import { FC, ReactNode } from "react";
import { Button, SxProps, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontSize,
  padding,
} from "../../../styles/constants";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";

export const COPY_BUTTON_WIDTH = 150;
export const COPY_BUTTON_HEIGHT = 32;

interface CopyButtonConfig {
  iconBeforeCopy?: ReactNode;
  iconAfterCopy?: ReactNode;
  textBeforeCopy?: string;
  textAfterCopy?: string;
}

const COPY_BUTTON_CONFIG_DEFAULT: CopyButtonConfig = {
  iconBeforeCopy: <ContentCopy fontSize="small" color="primary" />,
  iconAfterCopy: <DoneAllIcon fontSize="small" color="primary" />,
  textBeforeCopy: "Copy",
  textAfterCopy: "Is Copied",
};

interface CopyButtonProps {
  handleClick: () => void;
  hasBeenCopied?: boolean;
  copyText: string;
  copyButtonConfig?: CopyButtonConfig;
  sx?: SxProps;
}

const CopyButton: FC<CopyButtonProps> = ({
  handleClick,
  hasBeenCopied = false,
  copyText,
  copyButtonConfig,
  sx,
}) => {
  const { iconBeforeCopy, iconAfterCopy, textBeforeCopy, textAfterCopy } =
    mergeWithDefaults(COPY_BUTTON_CONFIG_DEFAULT, copyButtonConfig);

  return (
    <Button
      onClick={handleClick}
      data-testid={`copy-button-${copyText}`}
      sx={{
        width: COPY_BUTTON_WIDTH,
        height: COPY_BUTTON_HEIGHT,
        px: padding.medium,
        borderRadius: borderRadius.small,
        bgcolor: "#fff",
        border: `${border.xs} ${color.blue.darkSemiTransparent}`,
        "&:hover": {
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          backgroundColor: "#fff",
        },
        ...sx,
      }}
    >
      {hasBeenCopied ? iconAfterCopy : iconBeforeCopy}
      <Typography
        sx={{ padding: 0, paddingLeft: padding.small }}
        fontSize={fontSize.label}
        color={color.blue.dark}
      >
        {hasBeenCopied ? textAfterCopy : textBeforeCopy}
      </Typography>
    </Button>
  );
};

export default CopyButton;

import { FC, ReactNode } from "react";
import { Button, SxProps, Typography } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import rc8Theme from "../../../styles/themeRC8";
import { ContentCopyIcon } from "../../../assets/icons/download/contentCopy";

interface CopyButtonConfig {
  iconBeforeCopy?: ReactNode;
  iconAfterCopy?: ReactNode;
  textBeforeCopy?: string;
  textAfterCopy?: string;
}

const COPY_BUTTON_CONFIG_DEFAULT: CopyButtonConfig = {
  iconBeforeCopy: <ContentCopyIcon height={24} width={24} />,
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
        borderRadius: "6px",
        bgcolor: "#fff",
        border: `1px solid ${rc8Theme.palette.primary1}`,
        "&:hover": {
          border: `2px solid ${rc8Theme.palette.primary1}`,
          backgroundColor: "#fff",
        },
        ...sx,
      }}
    >
      {hasBeenCopied ? iconAfterCopy : iconBeforeCopy}
      <Typography
        variant="body1Medium"
        sx={{ color: rc8Theme.palette.text2, pl: "12px" }}
      >
        {hasBeenCopied ? textAfterCopy : textBeforeCopy}
      </Typography>
    </Button>
  );
};

export default CopyButton;

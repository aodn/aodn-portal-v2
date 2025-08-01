import { ElementType, FC, isValidElement, ReactNode } from "react";
import { Button, SxProps, Tooltip, Typography } from "@mui/material";
import { color, padding } from "../../../styles/constants";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import rc8Theme from "../../../styles/themeRC8";

export enum ResultCardButtonSize {
  SMALL = "small",
  MEDIUM = "medium",
}
export interface ResultCardButtonConfig {
  color?: string;
  size?: ResultCardButtonSize;
}

interface ResultCardButtonProps {
  onClick?: () => void;
  startIcon?: ElementType | ReactNode;
  text?: string | null;
  resultCardButtonConfig?: ResultCardButtonConfig;
  sx?: SxProps;
  shouldHideText?: boolean;
  disabled?: boolean;
}

// Memoize font sizes for performance
const fontSizes = {
  [ResultCardButtonSize.SMALL]: { icon: "14px", text: "12px" },
  [ResultCardButtonSize.MEDIUM]: { icon: "18px", text: "14px" },
};

const defaultConfig: ResultCardButtonConfig = {
  color: color.blue.dark,
  size: ResultCardButtonSize.SMALL,
};

const ResultCardButton: FC<ResultCardButtonProps> = ({
  onClick = () => {},
  startIcon,
  text,
  resultCardButtonConfig,
  sx,
  shouldHideText = false,
  disabled = false,
}) => {
  const config = mergeWithDefaults(defaultConfig, resultCardButtonConfig);
  const size = config.size ?? ResultCardButtonSize.SMALL; // Fallback for safety
  const hasText = text && !shouldHideText;
  const IconComponent = startIcon as ElementType;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        p: 0,
        textTransform: "none",
        opacity: disabled ? 0.5 : 1,
        minWidth: hasText ? "auto" : 0, // Optimize layout when text is hidden
        ...sx,
      }}
    >
      {startIcon &&
        (isValidElement(startIcon) ? (
          startIcon
        ) : (
          <Tooltip title={text || ""} placement="top">
            {
              // Need span to allow tooltip forwardRef()
            }
            <span>
              <IconComponent
                sx={{ color: config.color, fontSize: fontSizes[size].icon }}
              />
            </span>
          </Tooltip>
        ))}

      {hasText && (
        <Typography
          pt={0}
          pl={padding.extraSmall}
          mt={-0.5}
          variant="body2Regular"
          color={rc8Theme.palette.text1}
          whiteSpace="nowrap"
        >
          {text}
        </Typography>
      )}
    </Button>
  );
};

export default ResultCardButton;

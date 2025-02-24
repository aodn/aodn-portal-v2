import { ElementType, FC, isValidElement } from "react";
import { Button, SxProps, Tooltip, Typography } from "@mui/material";
import { color, padding } from "../../../styles/constants";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";

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
  startIcon?: ElementType;
  text?: string | null;
  resultCardButtonConfig?: ResultCardButtonConfig;
  sx?: SxProps;
  shouldHideText?: boolean;
  disable?: boolean;
}

const defaultResultCardButtonConfig: ResultCardButtonConfig = {
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
  disable = false,
}) => {
  const IconComponent = startIcon as ElementType;
  const config = mergeWithDefaults(
    defaultResultCardButtonConfig,
    resultCardButtonConfig
  );

  return (
    <Button
      onClick={onClick}
      disabled={disable}
      sx={{
        padding: padding.extraSmall,
        textTransform: "none",
        opacity: disable ? 0.5 : 1,
        ...sx,
      }}
    >
      {isValidElement(startIcon) ? (
        startIcon
      ) : (
        <Tooltip title={text} placement="top">
          <IconComponent
            sx={{
              color: config.color,
              fontSize: config.size === "small" ? "14px" : "18px",
            }}
          />
        </Tooltip>
      )}

      {text && !shouldHideText && (
        <Typography
          padding={0}
          pl={padding.extraSmall}
          fontSize={config.size === "small" ? "12px" : "14px"}
          color={config.color}
        >
          {text}
        </Typography>
      )}
    </Button>
  );
};

export default ResultCardButton;

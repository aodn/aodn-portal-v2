import { ElementType, FC, isValidElement } from "react";
import { Button, SxProps, Tooltip, Typography } from "@mui/material";
import { color, fontSize, padding } from "../../../styles/constants";
import { mergeWithDefaults } from "../utils";

interface ResultCardButtonConfig {
  color?: string;
  size?: string;
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
  size: "small",
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
    <Tooltip title={text} placement="top">
      <Button
        onClick={disable ? () => {} : onClick}
        sx={{ padding: padding.extraSmall, ...sx }}
      >
        {isValidElement(startIcon) ? (
          startIcon
        ) : (
          <IconComponent fontSize="small" sx={{ color: config.color }} />
        )}

        {text && !shouldHideText && (
          <Typography
            padding={0}
            pl={padding.extraSmall}
            fontSize={config.size === "small" ? fontSize.label : fontSize.icon}
            color={
              config.color === "success" ? color.success.main : config.color
            }
          >
            {text}
          </Typography>
        )}
      </Button>
    </Tooltip>
  );
};

export default ResultCardButton;

import {
  ElementType,
  FC,
  isValidElement,
  ReactNode,
  useMemo,
  useRef,
} from "react";
import { Button, SxProps, Tooltip, Typography } from "@mui/material";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import { OpenType } from "../../../hooks/useTabNavigation";
import { portalTheme } from "../../../styles";
import ContextMenu, { ContextMenuRef } from "../../menu/ContextMenu";

export enum ResultCardButtonSize {
  SMALL = "small",
  MEDIUM = "medium",
}
export interface ResultCardButtonConfig {
  color?: string;
  size?: ResultCardButtonSize;
}

interface ResultCardButtonProps {
  disabled?: boolean;
  isInteractive?: boolean;
  resultCardButtonConfig?: ResultCardButtonConfig;
  startIcon?: ElementType | ReactNode;
  shouldHideText?: boolean;
  sx?: SxProps;
  text?: string | null;
  onClick?: (type: OpenType | undefined) => void;
  isSvgIcon?: boolean;
  iconSize?: number;
}

const buttonStyles = {
  ...portalTheme.typography.body2Regular,
  color: portalTheme.palette.primary1,
};

// Memoize font sizes for performance
const fontSizes = {
  [ResultCardButtonSize.SMALL]: { icon: "14px", text: "12px" },
  [ResultCardButtonSize.MEDIUM]: { icon: "14px", text: "14px" },
};

export const DEFAULT_RESULT_CARD_BUTTON_SIZE = ResultCardButtonSize.MEDIUM;

const DEFAULT_SVG_ICON_SIZE = 20;

const defaultConfig: ResultCardButtonConfig = {
  color: portalTheme.palette.primary1,
  size: DEFAULT_RESULT_CARD_BUTTON_SIZE,
};

const ResultCardButton: FC<ResultCardButtonProps> = ({
  onClick = undefined,
  startIcon,
  text,
  resultCardButtonConfig,
  sx,
  shouldHideText = false,
  disabled = false,
  isInteractive = true,
  isSvgIcon = false,
  iconSize = undefined,
}) => {
  const IconComponent = startIcon as ElementType;
  const menuRef = useRef<ContextMenuRef>(null);

  const [config, size, hasText] = useMemo(() => {
    const config = mergeWithDefaults(defaultConfig, resultCardButtonConfig);
    const size = config.size ?? ResultCardButtonSize.SMALL; // Fallback for safety
    const hasText = text && !shouldHideText;
    return [config, size, hasText];
  }, [resultCardButtonConfig, shouldHideText, text]);

  const iconStyleProps = useMemo(() => {
    if (isSvgIcon) {
      const px = iconSize ?? DEFAULT_SVG_ICON_SIZE;
      return { color: config.color, width: px, height: px };
    }

    return {
      sx: {
        color: config.color,
        fontSize: iconSize ? `${iconSize}px` : fontSizes[size].icon,
      },
    };
  }, [config.color, iconSize, isSvgIcon, size]);

  const button = (
    <Button
      onContextMenu={(e) =>
        onClick ? menuRef.current?.openContextMenu(e) : undefined
      }
      onClick={() => onClick?.(undefined)}
      disabled={disabled}
      sx={{
        p: 0.5,
        gap: "10px",
        textTransform: "none",
        opacity: disabled ? 0.5 : 1,
        minWidth: hasText ? "auto" : 0, // Optimize layout when text is hidden
        cursor: isInteractive ? undefined : "default",
        ...sx,
      }}
    >
      {startIcon &&
        (isValidElement(startIcon) ? (
          startIcon
        ) : (
          <IconComponent {...iconStyleProps} />
        ))}

      {hasText && (
        <Typography
          pt={0}
          mt={-0.5}
          whiteSpace="nowrap"
          // Label tracks the icon colour, so status buttons (e.g. "On going")
          // read as one unit rather than a green icon beside a blue label
          sx={{
            ...buttonStyles,
            fontSize: fontSizes[size].text,
            color: config.color,
          }}
          data-testid={`result-card-button-${text}`}
        >
          {text}
        </Typography>
      )}
    </Button>
  );

  return (
    <>
      <ContextMenu ref={menuRef} onClick={onClick} sx={buttonStyles} />
      {shouldHideText ? (
        <Tooltip title={text || ""} placement="top">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </>
  );
};

export default ResultCardButton;

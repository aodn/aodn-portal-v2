import {
  ElementType,
  FC,
  isValidElement,
  ReactNode,
  useMemo,
  useRef,
} from "react";
import { Button, SxProps, Tooltip, Typography } from "@mui/material";
import { color, padding } from "../../../styles/constants";
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
  resultCardButtonConfig?: ResultCardButtonConfig;
  startIcon?: ElementType | ReactNode;
  shouldHideText?: boolean;
  sx?: SxProps;
  text?: string | null;
  onClick?: (type: OpenType | undefined) => void;
}

const buttonStyles = {
  ...portalTheme.typography.body2Regular,
  color: portalTheme.palette.primary1,
};

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
  onClick = undefined,
  startIcon,
  text,
  resultCardButtonConfig,
  sx,
  shouldHideText = false,
  disabled = false,
}) => {
  const IconComponent = startIcon as ElementType;
  const menuRef = useRef<ContextMenuRef>(null);

  const [config, size, hasText] = useMemo(() => {
    const config = mergeWithDefaults(defaultConfig, resultCardButtonConfig);
    const size = config.size ?? ResultCardButtonSize.SMALL; // Fallback for safety
    const hasText = text && !shouldHideText;
    return [config, size, hasText];
  }, [resultCardButtonConfig, shouldHideText, text]);

  return (
    <>
      <ContextMenu ref={menuRef} onClick={onClick} sx={buttonStyles} />
      <Button
        onContextMenu={(e) =>
          onClick ? menuRef.current?.openContextMenu(e) : undefined
        }
        onClick={() => onClick?.(undefined)}
        disabled={disabled}
        sx={{
          p: 0,
          gap: "6px",
          ml: "-14px",
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
            whiteSpace="nowrap"
            sx={buttonStyles}
            data-testid={`result-card-button-${text}`}
          >
            {text}
          </Typography>
        )}
      </Button>
    </>
  );
};

export default ResultCardButton;

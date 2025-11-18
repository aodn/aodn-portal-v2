import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { Box, Button, Grid, SxProps } from "@mui/material";
import MarkdownRenderer from "../../../common/text/MarkdownRenderer";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import rc8Theme from "../../../../styles/themeRC8";
import useClipboard from "../../../../hooks/useClipboard";
import CopyButton, {
  CopyButtonBasic,
} from "../../../common/buttons/CopyButton";

const LINE_CLAMP_DEFAULT = 10; // Default number of lines to show before expanding
const LINE_CLAMP_DEFAULT_TABLET = 7;
const LINE_CLAMP_DEFAULT_MOBILE = 5;

interface ExpandableTextAreaProps {
  text: string;
  isExpandable?: boolean;
  isCopyable?: boolean;
  showCopyOnHover?: boolean;
  onClickExpand?: () => void;
  showMoreStr?: string;
  // Configuration for line clamping, allowing different values for different breakpoints
  lineClampConfig?: {
    default?: number;
    tablet?: number;
    mobile?: number;
  };
  copyButtonConfig?: CopyButtonBasic;
  sx?: SxProps;
}

const ExpandableTextArea: React.FC<ExpandableTextAreaProps> = ({
  text,
  isExpandable = false,
  isCopyable = false,
  showCopyOnHover = true,
  onClickExpand = () => {},
  showMoreStr = "Show More",
  lineClampConfig = {
    default: LINE_CLAMP_DEFAULT,
    tablet: LINE_CLAMP_DEFAULT_TABLET,
    mobile: LINE_CLAMP_DEFAULT_MOBILE,
  },
  copyButtonConfig,
  sx,
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const { checkIsCopied, copyToClipboard } = useClipboard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [hoverOnContent, setHoverOnContent] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onShowMoreClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const onCopyButtonClick = useCallback(async () => {
    if (copyButtonConfig?.copyToClipboard) {
      await copyButtonConfig.copyToClipboard(text);
    } else {
      await copyToClipboard(text);
    }
  }, [copyButtonConfig, copyToClipboard, text]);

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

  // Check if content actually needs expansion by measuring DOM
  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;

      // If scrollHeight > clientHeight, content is being truncated
      setNeedsExpansion(scrollHeight > clientHeight);
    }
  }, [text, isExpanded]);

  return (
    <TextAreaBaseGrid sx={{ width: "100%", ...sx }}>
      <Grid
        item
        xs={12}
        onMouseEnter={() => setHoverOnContent(true)}
        onMouseLeave={() => setHoverOnContent(false)}
      >
        <Box
          sx={{
            ...(isExpandable && {
              cursor: "pointer",
            }),
          }}
          onClick={isExpandable ? onClickExpand : undefined}
          onKeyDown={
            isExpandable
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClickExpand();
                  }
                }
              : undefined
          }
        >
          <Box
            ref={contentRef}
            sx={{
              position: "relative",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: isExpanded
                ? "unset"
                : isUnderLaptop
                  ? isMobile
                    ? lineClampConfig.mobile
                    : lineClampConfig.tablet
                  : lineClampConfig.default,
              WebkitBoxOrient: "vertical",
            }}
            data-testid="expandable-text-area"
          >
            <MarkdownRenderer text={text}>
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
            </MarkdownRenderer>
          </Box>
        </Box>
      </Grid>
      {(needsExpansion || isExpanded) && (
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            onClick={onShowMoreClick}
            sx={{
              ...rc8Theme.typography.body1Medium,
              color: rc8Theme.palette.text2,
            }}
          >
            {isExpanded ? "Show Less" : showMoreStr}
          </Button>
        </Grid>
      )}
    </TextAreaBaseGrid>
  );
};

export default ExpandableTextArea;

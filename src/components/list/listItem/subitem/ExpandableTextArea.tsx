import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { Box, Button, Grid, SxProps } from "@mui/material";
import { useClipboardContext } from "../../../../context/clipboard/ClipboardContext";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import MarkdownRenderer from "../../../common/text/MarkdownRenderer";
import CopyButton, {
  CopyButtonConfig,
} from "../../../common/buttons/CopyButton";
import rc8Theme from "../../../../styles/themeRC8";

const LINE_CLAMP_DEFAULT = 10; // Default number of lines to show before expanding
const LINE_CLAMP_DEFAULT_TABLET = 7;
const LINE_CLAMP_DEFAULT_MOBILE = 5;

interface ExpandableTextAreaProps extends CopyButtonConfig {
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
  const { checkIsCopied } = useClipboardContext();
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [hoverOnContent, setHoverOnContent] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onShowMoreClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const isVisibleCopyButton = useMemo(() => {
    const isCopied = checkIsCopied(text);
    if (showCopyOnHover) {
      return isCopied || hoverOnContent;
    } else {
      return true;
    }
  }, [checkIsCopied, hoverOnContent, showCopyOnHover, text]);

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
                  visible={isVisibleCopyButton}
                  copyText={text}
                  copyButtonConfig={copyButtonConfig}
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

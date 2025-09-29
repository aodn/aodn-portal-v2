import React, { useCallback, useState, useRef, useEffect } from "react";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { Box, Button, Grid } from "@mui/material";
import MarkdownRenderer from "../../../common/text/MarkdownRenderer";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import rc8Theme from "../../../../styles/themeRC8";

const LINE_CLAMP_DEFAULT = 10; // Default number of lines to show before expanding
const LINE_CLAMP_DEFAULT_TABLET = 7;
const LINE_CLAMP_DEFAULT_MOBILE = 5;

interface ExpandableTextAreaProps {
  text: string;
  isClickable?: boolean;
  onClick?: () => void;
  showMoreStr?: string;
  // Configuration for line clamping, allowing different values for different breakpoints
  lineClampConfig?: {
    default?: number;
    tablet?: number;
    mobile?: number;
  };
}

const ExpandableTextArea: React.FC<ExpandableTextAreaProps> = ({
  text,
  isClickable = false,
  onClick = () => {},
  showMoreStr = "Show More",
  lineClampConfig = {
    default: LINE_CLAMP_DEFAULT,
    tablet: LINE_CLAMP_DEFAULT_TABLET,
    mobile: LINE_CLAMP_DEFAULT_MOBILE,
  },
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

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
    <TextAreaBaseGrid sx={{ width: "100%" }}>
      <Grid item md={12}>
        <Box
          sx={{
            ...(isClickable && {
              cursor: "pointer",
            }),
          }}
          onClick={isClickable ? onClick : undefined}
          onKeyDown={
            isClickable
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                  }
                }
              : undefined
          }
        >
          <Box
            ref={contentRef}
            sx={{
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
            <MarkdownRenderer text={text} />
          </Box>
        </Box>
      </Grid>
      {(needsExpansion || isExpanded) && (
        <Grid item md={12} display="flex" justifyContent="flex-end">
          <Button
            onClick={onButtonClick}
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

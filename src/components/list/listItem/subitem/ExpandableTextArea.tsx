import React, { useCallback, useState, useRef, useEffect } from "react";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { Box, Button, Grid } from "@mui/material";
import MarkdownRenderer from "../../../common/MarkdownRenderer";
import useBreakpoint from "../../../../hooks/useBreakpoint";

const LINE_CLAMP_DEFAULT = 10; // Default number of lines to show before expanding
const LINE_CLAMP_DEFAULT_TABLET = 7;
const LINE_CLAMP_DEFAULT_MOBILE = 5;
interface ExpandableTextAreaProps {
  text: string;
  isClickable?: boolean;
  onClick?: () => void;
  showMoreStr?: string;
}

const ExpandableTextArea: React.FC<ExpandableTextAreaProps> = ({
  text,
  isClickable = false,
  onClick = () => {},
  showMoreStr = "Show More",
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
    <TextAreaBaseGrid>
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
          data-testid="expandable-text-area"
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
                    ? LINE_CLAMP_DEFAULT_MOBILE
                    : LINE_CLAMP_DEFAULT_TABLET
                  : LINE_CLAMP_DEFAULT,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.6,
            }}
          >
            <MarkdownRenderer text={text} />
          </Box>
        </Box>
      </Grid>
      {(needsExpansion || isExpanded) && (
        <Grid item md={12} display="flex" justifyContent="flex-end">
          <Button onClick={onButtonClick}>
            {isExpanded ? "Show Less" : showMoreStr}
          </Button>
        </Grid>
      )}
    </TextAreaBaseGrid>
  );
};

export default ExpandableTextArea;

import React, { useCallback, useState } from "react";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { Button, Grid, Typography } from "@mui/material";
import {
  decodeHtmlEntities,
  truncateText,
  enrichHTML,
} from "../../../../utils/StringUtils";

interface ExpandableTextAreaProps {
  text: string;
  isClickable?: boolean;
  onClick?: () => void;
  truncateCount?: number;
  showMoreStr?: string;
}

const defaultTruncateCount = 430;

const ExpandableTextArea: React.FC<ExpandableTextAreaProps> = ({
  text,
  isClickable = false,
  onClick = () => {},
  truncateCount = defaultTruncateCount,
  showMoreStr = "Show More",
}) => {
  const decodedText = decodeHtmlEntities(text);
  const doesNeedTruncation = decodedText.length > truncateCount;

  const [isExpanded, setIsExpanded] = useState(false);

  const onButtonClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <TextAreaBaseGrid>
      <Grid item md={12}>
        <Typography
          variant="detailContent"
          whiteSpace="pre-wrap"
          sx={{
            textAlign: "left",
            ...(isClickable && {
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }),
          }}
          onClick={onClick}
          data-testid="expandable-text-area"
        >
          {isExpanded ? decodedText : truncateText(decodedText, truncateCount)}
        </Typography>
      </Grid>
      <Grid item md={12} display="flex" justifyContent="flex-end">
        {doesNeedTruncation && (
          <Button onClick={onButtonClick}>
            {isExpanded ? "Show Less" : showMoreStr}
          </Button>
        )}
      </Grid>
    </TextAreaBaseGrid>
  );
};

export default ExpandableTextArea;

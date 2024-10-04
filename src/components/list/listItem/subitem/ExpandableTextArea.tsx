import React, { useCallback, useState } from "react";
import TextAreaBaseGrid from "./TextAreaBaseGrid";
import { Button, Grid, Typography } from "@mui/material";
import {
  decodeHtmlEntities,
  truncateText,
} from "../../../../utils/StringUtils";

interface ExpandableTextAreaProps {
  text: string;
  isClickable?: boolean;
  onClick?: () => void;
}

const truncateCount = 430;

const ExpandableTextArea: React.FC<ExpandableTextAreaProps> = ({
  text,
  isClickable = false,
  onClick = () => {},
}) => {
  const decodedText = decodeHtmlEntities(text);
  const truncatedText = truncateText(decodedText, truncateCount);
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
        >
          {isExpanded ? decodedText : truncatedText}
        </Typography>
      </Grid>
      <Grid item md={12} display="flex" justifyContent="flex-end">
        {doesNeedTruncation && (
          <Button onClick={onButtonClick}>
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </Grid>
    </TextAreaBaseGrid>
  );
};

export default ExpandableTextArea;

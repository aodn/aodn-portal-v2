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

  // In the typography we cannot use white-space="pre" in sx because
  // we need to format the http link to html
  return (
    <TextAreaBaseGrid>
      <Grid item md={12}>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{
            __html: isExpanded
              ? enrichHTML(decodedText)
              : enrichHTML(truncateText(decodedText, truncateCount)),
          }}
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
        />
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
function enrchHTML(arg0: string) {
  throw new Error("Function not implemented.");
}

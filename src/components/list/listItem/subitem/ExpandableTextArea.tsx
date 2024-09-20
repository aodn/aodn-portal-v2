import React, { useCallback, useState } from "react";
import TextAreaGrid from "./TextAreaGrid";
import { Button, Grid, Typography } from "@mui/material";

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
  const truncatedText =
    text.length > truncateCount ? text.slice(0, truncateCount) + "..." : text;
  const doesNeedTruncation = text.length > truncateCount;

  const [isExpanded, setIsExpanded] = useState(false);

  const onButtonClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <TextAreaGrid>
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
          {isExpanded ? text : truncatedText}
        </Typography>
      </Grid>
      <Grid item md={12} display="flex" justifyContent="flex-end">
        {doesNeedTruncation && (
          <Button onClick={onButtonClick}>
            {isExpanded ? "show less" : "show more"}
          </Button>
        )}
      </Grid>
    </TextAreaGrid>
  );
};

export default ExpandableTextArea;

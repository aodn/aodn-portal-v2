import { Link } from "@mui/material";
import {
  COMBINED_LINK_REGEX,
  isEmail,
  isUrl,
  LINE_BREAK_REGEX,
} from "../../../utils/StringUtils";
import { portalTheme } from "../../../styles";
import { FC, Fragment } from "react";

interface TextRenderProps {
  text: string;
}

const TextRender: FC<TextRenderProps> = ({ text }) => {
  const renderTextWithLinks = (text: string) => {
    // First split by <br/> or <br> tags
    const lines = text.split(LINE_BREAK_REGEX);

    return lines.map((line, lineIndex) => {
      // For each line, split by the link regex
      const parts = line.split(COMBINED_LINK_REGEX);

      const renderedParts = parts.map((part, partIndex) => {
        // Check if part is an email
        if (isEmail(part)) {
          return (
            <Link
              key={`${lineIndex}-${partIndex}`}
              href={`mailto:${part}`}
              color="primary"
              underline="hover"
              sx={{
                ...portalTheme.typography.body2Regular,
                color: portalTheme.palette.primary.main,
                wordBreak: "break-all",
              }}
            >
              {part}
            </Link>
          );
        }

        // Check if part is a URL
        if (isUrl(part)) {
          return (
            <Link
              key={`${lineIndex}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              underline="hover"
              sx={{
                ...portalTheme.typography.body2Regular,
                color: portalTheme.palette.primary.main,
                wordBreak: "break-all",
              }}
            >
              {part}
            </Link>
          );
        }

        return <Fragment key={`${lineIndex}-${partIndex}`}>{part}</Fragment>;
      });

      // Add line breaks between lines (except for the last line)
      return (
        <Fragment key={lineIndex}>
          {renderedParts}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      );
    });
  };

  return <>{renderTextWithLinks(text)}</>;
};

export default TextRender;

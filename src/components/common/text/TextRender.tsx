import { Link } from "@mui/material";
import {
  COMBINED_LINK_REGEX,
  isEmail,
  isUrl,
} from "../../../utils/StringUtils";
import rc8Theme from "../../../styles/themeRC8";
import { FC } from "react";

interface TextRenderProps {
  text: string;
}

const TextRender: FC<TextRenderProps> = ({ text }) => {
  const renderTextWithLinks = (text: string) => {
    const parts = text.split(COMBINED_LINK_REGEX);

    return parts.map((part, index) => {
      // Check if part is an email
      if (isEmail(part)) {
        return (
          <Link
            key={index}
            href={`mailto:${part}`}
            color="primary"
            underline="hover"
            sx={{
              ...rc8Theme.typography.body2Regular,
              color: rc8Theme.palette.primary.main,
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
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
            sx={{
              ...rc8Theme.typography.body2Regular,
              color: rc8Theme.palette.primary.main,
              wordBreak: "break-all",
            }}
          >
            {part}
          </Link>
        );
      }

      return part;
    });
  };
  return <>{renderTextWithLinks(text)}</>;
};

export default TextRender;

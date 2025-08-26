import { FC } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
} from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

// Simple Markdown Renderer Supports:
// Lists: Each item on new line, start with -.
// Headings: # H1, ## H2, ### H3, #### H4.
// Bold: **text**.
// Italics: *text*.
// Links: URLs (www/http/https) as [text](www/http/https).

interface MarkdownRendererProps {
  text: string;
}

// Simple markdown parser for basic elements
const parseMarkdown = (text: string) => {
  const elements: any[] = [];
  const lines = text.split("\n");
  let currentList: any = null;
  let listItems: any[] = [];

  const flushList = () => {
    if (currentList && listItems.length > 0) {
      elements.push({
        type: "list",
        items: [...listItems],
        key: `list-${elements.length}`,
      });
      listItems = [];
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Handle headings - check for # at the start, with or without space
    if (trimmed.startsWith("####")) {
      flushList();
      const content = trimmed.replace(/^###\s*/, "");
      elements.push({
        type: "heading4",
        content: content,
        key: `h4-${index}`,
      });
      return;
    }

    if (trimmed.startsWith("###")) {
      flushList();
      const content = trimmed.replace(/^###\s*/, "");
      elements.push({
        type: "heading3",
        content: content,
        key: `h3-${index}`,
      });
      return;
    }

    if (trimmed.startsWith("##")) {
      flushList();
      const content = trimmed.replace(/^##\s*/, "");
      elements.push({
        type: "heading2",
        content: content,
        key: `h2-${index}`,
      });
      return;
    }

    if (trimmed.startsWith("#")) {
      flushList();
      const content = trimmed.replace(/^#\s*/, "");
      elements.push({
        type: "heading1",
        content: content,
        key: `h1-${index}`,
      });
      return;
    }

    // Handle list items - check for - at the start, with or without space
    if (trimmed.startsWith("-")) {
      if (!currentList) {
        currentList = "bullet";
      }
      const content = trimmed.replace(/^-\s*/, "");
      listItems.push({
        content: content,
        key: `li-${index}`,
      });
      return;
    }

    // Handle regular paragraphs
    flushList();
    elements.push({
      type: "paragraph",
      content: trimmed,
      key: `p-${index}`,
    });
  });

  flushList();
  return elements;
};

// Process inline markdown (bold, italic, links, etc.)
const processInlineMarkdown = (text: string) => {
  const parts: any[] = [];
  let currentIndex = 0;

  // Combined regex for bold, italic, and links
  const inlineRegex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      if (beforeText) {
        parts.push({ type: "text", content: beforeText });
      }
    }

    if (match[1]) {
      // Bold text **text**
      parts.push({ type: "bold", content: match[2] });
    } else if (match[3]) {
      // Italic text *text*
      parts.push({ type: "italic", content: match[4] });
    } else if (match[5]) {
      // Link [text](url)
      parts.push({
        type: "link",
        content: match[6],
        url: match[7],
      });
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    if (remainingText) {
      parts.push({ type: "text", content: remainingText });
    }
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
};

// Render inline content with MUI components
const renderInlineContent = (text: string) => {
  const parts = processInlineMarkdown(text);

  return parts.map((part, index) => {
    switch (part.type) {
      case "bold":
        return (
          <Typography
            key={index}
            component="span"
            variant="body2Regular"
            fontWeight={500}
          >
            {part.content}
          </Typography>
        );
      case "italic":
        return (
          <Typography
            key={index}
            component="span"
            variant="body2Regular"
            fontStyle="italic"
          >
            {part.content}
          </Typography>
        );
      case "link":
        return (
          <MuiLink
            key={index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2Regular"
            sx={{
              color: rc8Theme.palette.primary.main,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {part.content}
          </MuiLink>
        );
      case "text":
      default:
        return <>{part.content}</>;
    }
  });
};

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ text }) => {
  const elements = parseMarkdown(text);

  return (
    <>
      {elements.map((element) => {
        switch (element.type) {
          case "heading1":
            return (
              <Typography
                key={element.key}
                variant="heading3"
                component="h1"
                my={1}
              >
                {renderInlineContent(element.content)}
              </Typography>
            );

          case "heading2":
            return (
              <Typography
                key={element.key}
                variant="heading4"
                component="h2"
                my={1}
              >
                {renderInlineContent(element.content)}
              </Typography>
            );

          case "heading3":
            return (
              <Typography
                key={element.key}
                variant="title1Medium"
                component="h3"
                my={0.5}
                fontWeight={500}
              >
                {renderInlineContent(element.content)}
              </Typography>
            );

          case "heading4":
            return (
              <Typography
                key={element.key}
                variant="title2Regular"
                component="h4"
                my={0.5}
                fontWeight={500}
              >
                {renderInlineContent(element.content)}
              </Typography>
            );

          case "paragraph":
            return (
              <Typography
                key={element.key}
                variant="body2Regular"
                paragraph
                mb={1}
              >
                {renderInlineContent(element.content)}
              </Typography>
            );

          case "list":
            return (
              <List
                key={element.key}
                sx={{
                  p: 0,
                  ml: 2,
                  mb: 1,
                  "& .MuiListItemText-root": {
                    m: 0,
                  },
                  "& .MuiListItem-root": {
                    p: 0,
                    display: "list-item",
                    listStyleType: "disc",
                    listStylePosition: "outside",
                    ml: 2,
                  },
                }}
              >
                {element.items.map((item: any) => (
                  <ListItem key={item.key}>
                    <ListItemText
                      primary={renderInlineContent(item.content)}
                      primaryTypographyProps={{
                        variant: "body2Regular",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default MarkdownRenderer;

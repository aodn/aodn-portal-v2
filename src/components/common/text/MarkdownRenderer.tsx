import { FC } from "react";
import {
  Typography,
  List,
  ListItem as MuiListItem,
  ListItemText,
  Link as MuiLink,
} from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";
import TextRender from "./TextRender";

// Simple Markdown Renderer Supports:
// Lists: Each item on new line, start with - or "number. ".
// Headings: # H1, ## H2, ### H3, #### H4.
// Bold: **text**.
// Italics: *text*.
// Links: URLs (www/http/https) as [text](www/http/https).

enum ElementType {
  Heading1 = "heading1",
  Heading2 = "heading2",
  Heading3 = "heading3",
  Heading4 = "heading4",
  Paragraph = "paragraph",
  List = "list",
  Bold = "bold",
  Italic = "italic",
  Link = "link",
  Text = "text",
}

enum ListType {
  Bullet = "bullet",
  Numbered = "numbered",
}

interface ListItem {
  content: string;
  key: string;
}

interface MarkdownElement {
  type: ElementType;
  content?: string;
  listType?: ListType;
  items?: ListItem[];
  key: string;
}

interface MarkdownRendererProps {
  text: string;
}

// Simple markdown parser for basic elements
const parseMarkdown = (text: string): MarkdownElement[] => {
  const elements: MarkdownElement[] = [];
  const lines = text.split("\n");
  let currentList: ListType | null = null;
  let listItems: ListItem[] = [];

  const flushList = () => {
    if (currentList && listItems.length > 0) {
      elements.push({
        type: ElementType.List,
        listType: currentList,
        items: [...listItems],
        key: `${ElementType.List}-${elements.length}`,
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
        type: ElementType.Heading4,
        content: content,
        key: `${ElementType.Heading4}-${index}`,
      });
      return;
    }

    if (trimmed.startsWith("###")) {
      flushList();
      const content = trimmed.replace(/^###\s*/, "");
      elements.push({
        type: ElementType.Heading3,
        content: content,
        key: `${ElementType.Heading3}-${index}`,
      });
      return;
    }

    if (trimmed.startsWith("##")) {
      flushList();
      const content = trimmed.replace(/^##\s*/, "");
      elements.push({
        type: ElementType.Heading2,
        content: content,
        key: `${ElementType.Heading2}-${index}`,
      });
      return;
    }

    if (trimmed.startsWith("#")) {
      flushList();
      const content = trimmed.replace(/^#\s*/, "");
      elements.push({
        type: ElementType.Heading1,
        content: content,
        key: `${ElementType.Heading1}-${index}`,
      });
      return;
    }

    // Handle numbered list items - check for number. at the start
    const numberedListMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedListMatch) {
      // If we're not in a numbered list or switching from bullet to numbered
      if (currentList !== ListType.Numbered) {
        flushList();
        currentList = ListType.Numbered;
      }
      const number = numberedListMatch[1];
      const text = numberedListMatch[2];
      const content = `${number}.\u00A0\u00A0${text}`;
      listItems.push({
        content: content,
        key: `${ElementType.List}-${index}`,
      });
      return;
    }

    // Handle bullet list items - check for - at the start, with or without space
    if (trimmed.startsWith("-")) {
      if (!currentList) {
        currentList = ListType.Bullet;
      }
      const content = trimmed.replace(/^-\s*/, "");
      listItems.push({
        content: content,
        key: `${ElementType.List}-${index}`,
      });
      return;
    }

    // Handle regular paragraphs
    flushList();
    elements.push({
      type: ElementType.Paragraph,
      content: trimmed,
      key: `${ElementType.Paragraph}-${index}`,
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
        parts.push({ type: ElementType.Text, content: beforeText });
      }
    }

    if (match[1]) {
      // Bold text **text**
      parts.push({ type: ElementType.Bold, content: match[2] });
    } else if (match[3]) {
      // Italic text *text*
      parts.push({ type: ElementType.Italic, content: match[4] });
    } else if (match[5]) {
      // Link [text](url)
      parts.push({
        type: ElementType.Link,
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
      parts.push({ type: ElementType.Text, content: remainingText });
    }
  }

  return parts.length > 0 ? parts : [{ type: ElementType.Text, content: text }];
};

// Render inline content with MUI components
const renderInlineContent = (text: string | undefined) => {
  if (!text) return null;
  const parts = processInlineMarkdown(text);

  return parts.map((part, index) => {
    switch (part.type) {
      case ElementType.Bold:
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
      case ElementType.Italic:
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
      case ElementType.Link:
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
              wordBreak: "break-all",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {part.content}
          </MuiLink>
        );
      case ElementType.Text:
        return <TextRender key={index} text={part.content} />;
      default:
        return <TextRender key={index} text={part.content} />;
    }
  });
};

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ text }) => {
  const elements = parseMarkdown(text);

  return (
    <>
      {elements.map((element) => {
        switch (element.type) {
          case ElementType.Heading1:
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

          case ElementType.Heading2:
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

          case ElementType.Heading3:
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

          case ElementType.Heading4:
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

          case ElementType.Paragraph:
            return (
              <Typography
                key={element.key}
                variant="body2Regular"
                paragraph
                mt={element.key === `${ElementType.Paragraph}-0}` ? 0 : 1}
                mb={1}
              >
                {renderInlineContent(element.content)}
              </Typography>
            );

          case ElementType.List:
            return (
              <List
                key={element.key}
                sx={{
                  p: 0,
                  ml: 2,
                  mb: element.listType === ListType.Numbered ? 0 : 1,
                  "& .MuiListItemText-root": {
                    m: 0,
                  },
                  "& .MuiListItem-root": {
                    p: 0,
                    display: "list-item",
                    listStyleType:
                      element.listType === ListType.Numbered ? "none" : "disc",
                    ml: element.listType === ListType.Numbered ? 0 : 2,
                  },
                }}
              >
                {element.items?.map((item: any) => (
                  <MuiListItem key={item.key}>
                    <ListItemText
                      primary={renderInlineContent(item.content)}
                      primaryTypographyProps={{
                        variant: "body2Regular",
                      }}
                    />
                  </MuiListItem>
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

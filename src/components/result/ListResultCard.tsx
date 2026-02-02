import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  border,
  borderRadius,
  color,
  gap,
  fontColor,
  fontSize,
  fontWeight,
  padding,
  lineHeight,
  fontFamily,
} from "../../styles/constants";
import React, { FC, SyntheticEvent, useRef, useState } from "react";
import OrganizationLogo from "../logo/OrganizationLogo";
import ResultCardButtonGroup from "./ResultCardButtonGroup";
import { ResultCardBasicType } from "./ResultCards";
import BookmarkButton from "../bookmark/BookmarkButton";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { LIST_CARD_TITLE_HEIGHT } from "./constants";
import { portalTheme } from "../../styles";
import { OpenType } from "../../hooks/useTabNavigation";
import ContextMenu, { ContextMenuRef } from "../menu/ContextMenu";

interface ListResultCardProps extends ResultCardBasicType {}

// for document records, render document tag
const renderDocumentScope = () => (
  <Box
    sx={{
      display: "inline-flex",
      width: "100px",
      height: "26px",
      padding: "2px 0",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      backgroundColor: color.success.light,
      fontFamily: fontFamily.general,
      fontSize: fontSize.resultCardTitle,
      fontWeight: fontWeight.regular,
      color: fontColor.black.dark,
      lineHeight: lineHeight.heading,
    }}
  >
    Document
  </Box>
);

// links here may need to be changed, because only html links are wanted
const ListResultCard: FC<ListResultCardProps> = ({
  content,
  onClickCard = undefined,
  onClickDetail = undefined,
  onClickLinks = undefined,
  onClickDownload = undefined,
  selectedUuid,
  isSimplified = false,
  sx,
}) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const menuRef = useRef<ContextMenuRef>(null);

  if (content) {
    const { id: uuid, title, description, findIcon, findThumbnail } = content;
    const isSelectedDataset = uuid === selectedUuid;
    const thumbnail: string = findThumbnail();
    const scope = content.getScope();
    const hasDocumentTag = scope?.toLowerCase() === "document";

    return (
      <Card
        id={`result-card-${uuid}`}
        elevation={isSelectedDataset ? 2 : 0}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          width: "100%",
          height: "100%",
          border: isSelectedDataset
            ? `${border.sm} ${color.blue.darkSemiTransparent}`
            : "none",
          borderRadius: borderRadius.small,
          paddingX: padding.medium,
          paddingY: padding.small,
          ...sx,
        }}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
        data-testid="result-card-list"
      >
        <ContextMenu
          ref={menuRef}
          onClick={(type: OpenType | undefined) => onClickDetail?.(uuid, type)}
        />
        <Box position="absolute" top={gap.md} right={gap.md}>
          <BookmarkButton dataset={content} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          height="100%"
          mr={gap.sm}
        >
          <Box maxHeight={isSimplified ? "100%" : "80%"}>
            <CardHeader
              sx={{
                height: "auto",
                maxHeight: 45,
                width: "95%",
                p: 0,
                "& .MuiCardHeader-action": {
                  margin: 0,
                },
              }}
              title={
                <Typography
                  onClick={() => onClickDetail?.(uuid)}
                  variant="title1Medium"
                  color={portalTheme.palette.text1}
                  title={title}
                  padding={0}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    cursor: "pointer",
                    alignItems: "flex-start",
                  }}
                  data-testid="result-card-title"
                  onContextMenu={(e) => menuRef.current?.openContextMenu(e)}
                >
                  <Tooltip title={title} arrow>
                    <>{title}</>
                  </Tooltip>
                </Typography>
              }
              action={
                isSimplified ? null : (
                  <OrganizationLogo
                    logo={findIcon()}
                    sx={{
                      width: "auto",
                      maxWidth: "200px",
                      height: LIST_CARD_TITLE_HEIGHT,
                      pr: padding.double,
                      pl: padding.large,
                    }}
                  />
                )
              }
            />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 0,
                "&:last-child": {
                  pb: 0,
                },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body3Small"
                  color={portalTheme.palette.text2}
                  arial-label="result-list-card-content"
                  onClick={() =>
                    isSimplified
                      ? onClickDetail?.(uuid)
                      : onClickCard?.(content)
                  }
                  sx={{
                    minHeight: 90,
                    pt: padding.extraSmall,
                    overflow: "hidden",
                    display: "-webkit-box",
                    cursor: "pointer",
                    WebkitLineClamp: hasDocumentTag
                      ? "4" // show less text for document records on responsive page
                      : isSimplified
                        ? 5 //defalt with 5 lines
                        : isSelectedDataset || showButtons
                          ? "4" // if mouse hovering or clicked, show 4 lines
                          : "5",

                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word",
                  }}
                >
                  {description}
                </Typography>
                {hasDocumentTag && !isSelectedDataset && !showButtons && (
                  <Box
                    sx={{
                      display: "flex",
                      height: "26px",
                      paddingLeft: "8px",
                      alignItems: "center",
                      gap: "16px",
                      mt: 0.5,
                    }}
                  >
                    {renderDocumentScope()}
                  </Box>
                )}
              </Box>
              {thumbnail !== default_thumbnail && (
                <Box
                  sx={{
                    maxWidth: 150,
                    height: 90,
                    padding: 1,
                  }}
                >
                  <img
                    src={thumbnail}
                    alt="org_logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                      e.preventDefault();
                      // This is a special case where the src is a valid url,
                      // but the url is not reachable, then we fallback to use the
                      // default thumbnail, and in this case like above we should hide
                      // the thumbnail
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        e.currentTarget.src = default_thumbnail;
                        parent.style.display = "none";
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Box>
          {(isSelectedDataset || showButtons) && !isSimplified && (
            <Box>
              <CardActions
                sx={{
                  backgroundColor: "white",
                }}
              >
                <ResultCardButtonGroup
                  content={content}
                  shouldHideText={isSimplified}
                  onLinks={(type: OpenType | undefined) =>
                    onClickLinks?.(uuid, type)
                  }
                  onDownload={
                    onClickDownload
                      ? (type: OpenType | undefined) =>
                          onClickDownload(uuid, type)
                      : undefined
                  }
                  onDetail={(type: OpenType | undefined) =>
                    onClickDetail?.(uuid, type)
                  }
                />
              </CardActions>
            </Box>
          )}
        </Box>
      </Card>
    );
  }
};

export default ListResultCard;

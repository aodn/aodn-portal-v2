import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../styles/constants";
import { FC, useState } from "react";
import OrganizationLogo from "../logo/OrganizationLogo";
import ResultCardButtonGroup from "./ResultCardButtonGroup";
import { ResultCardBasicType } from "./ResultCards";
import BookmarkButton from "../bookmark/BookmarkButton";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { LIST_CARD_TITLE_HEIGHT } from "./constants";

interface ListResultCardProps extends ResultCardBasicType {}

// links here may need to be changed, because only html links are wanted
const ListResultCard: FC<ListResultCardProps> = ({
  content,
  onClickCard = () => {},
  onClickDetail = () => {},
  onClickLinks = () => {},
  onClickDownload = () => {},
  selectedUuid,
  isSimplified = false,
  sx,
}) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  if (content) {
    const { id: uuid, title, description, findIcon, findThumbnail } = content;
    const isSelectedDataset = uuid === selectedUuid;
    const thumbnail: string = findThumbnail();

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
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          height="100%"
          mr={gap.sm}
        >
          <Box maxHeight={isSimplified ? "100%" : "80%"}>
            <CardHeader
              sx={{ p: 0 }}
              title={
                <Typography
                  onClick={() => onClickDetail(uuid)}
                  color={fontColor.gray.dark}
                  fontSize={fontSize.resultCardTitle}
                  fontWeight={fontWeight.bold}
                  title={title}
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
                >
                  <Tooltip title={title} arrow>
                    <>{title}</>
                  </Tooltip>
                </Typography>
              }
              action={
                <OrganizationLogo
                  logo={findIcon()}
                  sx={{
                    width: "auto",
                    maxWidth: "200px",
                    height: LIST_CARD_TITLE_HEIGHT,
                    paddingX: padding.double,
                  }}
                />
              }
            />
            <CardContent
              sx={{ p: 0, display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  arial-label="result-list-card-content"
                  color={fontColor.gray.medium}
                  fontSize={fontSize.resultCardContent}
                  onClick={() =>
                    isSimplified ? onClickDetail(uuid) : onClickCard(content)
                  }
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                    display: "-webkit-box",
                    cursor: "pointer",
                    WebkitLineClamp:
                      (isSelectedDataset || showButtons) && !isSimplified
                        ? "4"
                        : "6",
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word",
                  }}
                >
                  {description}
                </Typography>
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
                  shouldHideText
                  onLinks={() => onClickLinks(uuid)}
                  onDownload={() => onClickDownload(uuid)}
                  onDetail={() => onClickDetail(uuid)}
                />
              </CardActions>
            </Box>
          )}
        </Box>
        <Stack
          direction="column"
          flexWrap="nowrap"
          justifyContent="space-around"
          alignItems="center"
          height="100%"
        >
          <Box
            position="absolute"
            top={gap.lg}
            right={gap.lg}
            height="20px"
            width="auto"
          >
            <BookmarkButton dataset={content} />
          </Box>
        </Stack>
      </Card>
    );
  }
};

export default ListResultCard;

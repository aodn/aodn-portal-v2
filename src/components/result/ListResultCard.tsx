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
  onClickDownload = undefined,
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
                width: "95%",
                p: 0,
                "& .MuiCardHeader-action": {
                  margin: 0,
                },
              }}
              title={
                <Typography
                  onClick={() => onClickDetail(uuid)}
                  color={fontColor.gray.dark}
                  fontSize={
                    isSimplified
                      ? fontSize.resultCardTitleUnderLaptop
                      : fontSize.resultCardTitle
                  }
                  fontWeight={fontWeight.bold}
                  title={title}
                  padding={0}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: isSimplified ? undefined : "2",
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
                  arial-label="result-list-card-content"
                  color={fontColor.gray.medium}
                  fontSize={
                    isSimplified
                      ? fontSize.resultCardContentUnderLaptop
                      : fontSize.resultCardContent
                  }
                  onClick={() =>
                    isSimplified ? onClickDetail(uuid) : onClickCard(content)
                  }
                  sx={{
                    pt: padding.extraSmall,
                    overflow: "hidden",
                    display: "-webkit-box",
                    cursor: "pointer",
                    WebkitLineClamp: isSimplified
                      ? 5
                      : isSelectedDataset || showButtons
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
                  shouldHideText={isSimplified}
                  onLinks={() => onClickLinks(uuid)}
                  onDownload={
                    onClickDownload
                      ? () => onClickDownload(uuid)
                      : onClickDownload
                  }
                  onDetail={() => onClickDetail(uuid)}
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

import {
  Box,
  Card,
  CardActionArea,
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
          maxWidth="90%"
          mr={gap.sm}
        >
          <Tooltip title={title} placement="top">
            <CardActionArea onClick={() => onClickDetail(uuid)}>
              <Box
                display="flex"
                alignItems="center"
                height="45px"
                arial-label="result-list-card-title"
              >
                <Typography
                  color={fontColor.gray.dark}
                  fontSize={fontSize.resultCardTitle}
                  fontWeight={fontWeight.bold}
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                  data-testid="result-card-title"
                >
                  {title}
                </Typography>
              </Box>
            </CardActionArea>
          </Tooltip>
          <CardActionArea
            onClick={
              isSimplified
                ? () => onClickDetail(uuid)
                : () => onClickCard(content)
            }
            sx={{ flex: 1 }}
          >
            <Typography
              arial-label="result-list-card-content"
              color={fontColor.gray.medium}
              fontSize={fontSize.resultCardContent}
              sx={{
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: isSelectedDataset || showButtons ? "4" : "6",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {description}
            </Typography>
            {(isSelectedDataset || showButtons) && (
              <ResultCardButtonGroup
                content={content}
                shouldHideText
                onLinks={() => onClickLinks(uuid)}
                onDownload={() => onClickDownload(uuid)}
                onDetail={() => onClickDetail(uuid)}
              />
            )}
          </CardActionArea>
        </Box>
        <Stack
          direction="column"
          flexWrap="nowrap"
          justifyContent="space-around"
          alignItems="center"
          width="120px"
          height="100%"
        >
          <OrganizationLogo
            logo={findIcon()}
            sx={{
              width: "auto",
              maxWidth: "100px",
              height: "45px",
              paddingX: padding.extraSmall,
            }}
          />
          <Box
            position="absolute"
            top={gap.lg}
            right={gap.lg}
            height="20px"
            width="auto"
          >
            <BookmarkButton dataset={content} />
          </Box>
          <Box height="90px" width="100%">
            <img
              src={findThumbnail()}
              alt="org_logo"
              style={{
                objectFit:
                  findThumbnail() === default_thumbnail ? "cover" : "contain",
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        </Stack>
      </Card>
    );
  }
};

export default ListResultCard;

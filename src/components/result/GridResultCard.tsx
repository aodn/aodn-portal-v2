import { FC, SyntheticEvent, useState } from "react";
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
import OrganizationLogo from "../logo/OrganizationLogo";
import ResultCardButtonGroup from "./ResultCardButtonGroup";
import { ResultCardBasicType } from "./ResultCards";
import BookmarkButton from "../bookmark/BookmarkButton";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import rc8Theme from "../../styles/themeRC8";

interface GridResultCardProps extends ResultCardBasicType {}

const GridResultCard: FC<GridResultCardProps> = ({
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

  if (!content) return;
  const { id: uuid, title, findIcon, findThumbnail } = content;

  const isSelectedDataset = uuid === selectedUuid;
  return (
    <Card
      elevation={isSelectedDataset ? 2 : 0}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
        border: isSelectedDataset
          ? `${border.sm} ${color.blue.darkSemiTransparent}`
          : "none",
        borderRadius: borderRadius.small,
        ...sx,
      }}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      data-testid="result-card-grid"
    >
      <Box
        position="absolute"
        top={gap.lg}
        right={gap.lg}
        height="20px"
        width="auto"
        zIndex={1}
      >
        <BookmarkButton dataset={content} />
      </Box>

      <CardActionArea
        onClick={() =>
          isSimplified ? onClickDetail(uuid) : onClickCard(content)
        }
      >
        <Box
          height={isSelectedDataset || showButtons ? "110px" : "130px"}
          width="100%"
          overflow="hidden"
          border={`${border.sm} #fff`}
          borderRadius={borderRadius.small}
        >
          <img
            src={findThumbnail()}
            alt="org_logo"
            style={{
              objectFit: "fill",
              width: "100%",
              height: "auto",
            }}
            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
              e.preventDefault();
              e.currentTarget.src = default_thumbnail;
            }}
          />
        </Box>
      </CardActionArea>

      <Stack
        flex={1}
        direction="row"
        alignItems="center"
        paddingX={padding.small}
      >
        {!isSelectedDataset && !showButtons && (
          <OrganizationLogo
            logo={findIcon()}
            sx={{
              width: "auto",
              maxWidth: "60px",
              height: "45px",
              paddingRight: padding.extraSmall,
            }}
          />
        )}

        <Tooltip title="More details ..." placement="top">
          <CardActionArea onClick={() => onClickDetail(uuid)}>
            <Box
              display="flex"
              alignItems="center"
              arial-label="grid-list-card-title"
              data-testid="grid-card-title"
            >
              <Typography
                variant="title1Medium"
                color={rc8Theme.palette.text1}
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: isSelectedDataset || showButtons ? "2" : "4",
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                }}
              >
                {title}
              </Typography>
            </Box>
          </CardActionArea>
        </Tooltip>
      </Stack>
      {(isSelectedDataset || showButtons) && (
        <Stack
          direction="row"
          width="100%"
          paddingX={padding.small}
          gap={gap.sm}
        >
          <OrganizationLogo
            logo={findIcon()}
            sx={{
              width: "auto",
              maxWidth: "60px",
              height: "45px",
            }}
          />
          {!isSimplified && (
            <ResultCardButtonGroup
              content={content}
              shouldHideText
              isGridView
              onLinks={() => onClickLinks(uuid)}
              onDownload={
                onClickDownload ? () => onClickDownload(uuid) : onClickDownload
              }
              onDetail={() => onClickDetail(uuid)}
            />
          )}
        </Stack>
      )}
    </Card>
  );
};

export default GridResultCard;

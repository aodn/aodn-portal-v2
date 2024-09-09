import { Box, Card, CardActionArea, Stack, Typography } from "@mui/material";
import MapSpatialExtents from "@/assets/icons/map-spatial-extents.png";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  gap,
  padding,
} from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { FC, useCallback, useState } from "react";
import OrganizationLogo from "../logo/OrganizationLogo";
import ResultCardButtonGroup from "./ResultCardButtonGroup";

interface ResultCardProps {
  content: OGCCollection | undefined;
  onDownload?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onTags?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onMore?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onDetail?: ((uuid: string) => void) | undefined;
  onClickCard?: ((uuid: string) => void) | undefined;
  isSelectedDataset?: boolean;
}

// links here may need to be changed, because only html links are wanted
const ListResultCard: FC<ResultCardProps> = ({
  content,
  onDownload,
  onTags,
  onMore,
  onDetail,
  onClickCard,
  isSelectedDataset,
}) => {
  const [showButtons, setShowButtons] = useState<boolean>(true);

  const handleShowSpatialExtents = useCallback(() => {
    if (onClickCard && content && content.id) {
      onClickCard(content.id);
    }
  }, [content, onClickCard]);

  const handleNavigateToDetail = useCallback(() => {
    if (onDetail && content && content.id) {
      onDetail(content.id);
    }
  }, [content, onDetail]);

  if (!content) return;

  // TODO: buttons are changed, but the behaviors are fake / wrong
  return (
    <Card
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
        border: isSelectedDataset ? `${border.sm} ${color.blue.dark}` : "none",
        borderRadius: borderRadius.small,
        paddingX: padding.medium,
        paddingY: padding.small,
      }}
      data-testid="result-card-list"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex={1}
        height="100%"
        maxWidth="90%"
      >
        <CardActionArea onClick={handleNavigateToDetail}>
          <Box
            display="flex"
            alignItems="center"
            height="45px"
            arial-label="result-list-card-title"
          >
            <Typography
              color={fontColor.gray.dark}
              fontSize={fontSize.resultCardTitle}
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
              {content.title}
            </Typography>
          </Box>
        </CardActionArea>

        <CardActionArea onClick={handleShowSpatialExtents}>
          <Typography
            arial-label="result-list-card-content"
            color={fontColor.gray.medium}
            fontSize={fontSize.resultCardContent}
            sx={{
              padding: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: showButtons ? "4" : "5",
              WebkitBoxOrient: "vertical",
            }}
          >
            {content.description}
          </Typography>
        </CardActionArea>

        {showButtons && (
          <ResultCardButtonGroup
            content={content}
            onDownload={onDownload}
            onDetail={handleNavigateToDetail}
            shouldHideText={true}
          />
        )}
      </Box>

      <Stack
        direction="column"
        flexWrap="nowrap"
        justifyContent="center"
        alignItems="end"
        width="120px"
        height="100%"
      >
        <Box display="flex" flexDirection="row">
          <OrganizationLogo
            logo={content.findIcon()}
            sx={{
              width: "auto",
              maxWidth: "80px",
              height: "45px",
              paddingX: padding.extraSmall,
            }}
          />
          {isSelectedDataset && (
            <Box
              position="absolute"
              top={gap.lg}
              right={gap.lg}
              height="20px"
              width="auto"
            >
              <img
                src={MapSpatialExtents}
                alt="selected dataset"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          )}
        </Box>
        <Box height="90px" width="100%">
          <img
            src={content.findThumbnail()}
            alt="org_logo"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default ListResultCard;

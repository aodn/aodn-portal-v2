import {
  Box,
  Card,
  CardActionArea,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MapSpatialExtents from "@/assets/icons/map-spatial-extents.png";
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
import useTabNavigation from "../../hooks/useTabNavigation";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

interface ListResultCardProps {
  content?: OGCCollection;
  onClickCard?: (uuid: string) => void;
  isSelectedDataset?: boolean;
}

// links here may need to be changed, because only html links are wanted
const ListResultCard: FC<ListResultCardProps> = ({
  content,
  onClickCard = () => {},
  isSelectedDataset,
}) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const goToDetailPage = useTabNavigation();

  if (!content) return;
  const { id: uuid, title, description, findIcon, findThumbnail } = content;

  const onLinks = () => goToDetailPage(uuid, "links");
  const onDownload = () => goToDetailPage(uuid, "abstract", "download-section");
  const onDetail = () => goToDetailPage(uuid, "abstract");

  // TODO: buttons are changed, but the behaviors are fake / wrong
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
        border: isSelectedDataset ? `${border.sm} ${color.blue.dark}` : "none",
        borderRadius: borderRadius.small,
        paddingX: padding.medium,
        paddingY: padding.small,
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
        <Tooltip title="More details ..." placement="top">
          <CardActionArea onClick={() => goToDetailPage(uuid, "abstract")}>
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

        <CardActionArea onClick={() => onClickCard(uuid)} sx={{ flex: 1 }}>
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
        </CardActionArea>
        {(isSelectedDataset || showButtons) && (
          <ResultCardButtonGroup
            content={content}
            shouldHideText
            onLinks={onLinks}
            onDownload={onDownload}
            onDetail={onDetail}
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
            logo={findIcon()}
            sx={{
              width: "auto",
              maxWidth: "100px",
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
            src={findThumbnail()}
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

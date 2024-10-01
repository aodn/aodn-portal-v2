import { FC, useState } from "react";
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
import MapSpatialExtents from "@/assets/icons/map-spatial-extents.png";
import { ResultCard } from "./ResultCards";

interface GridResultCardProps extends ResultCard {
  isSelectedDataset?: boolean;
}

const GridResultCard: FC<GridResultCardProps> = ({
  content,
  onDownload = () => {},
  onLink = () => {},
  onDetail = () => {},
  onClickCard = () => {},
  isSelectedDataset,
}) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  if (!content) return;
  const { id: uuid, title, findIcon, findThumbnail } = content;

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
        border: isSelectedDataset ? `${border.sm} ${color.blue.dark}` : "none",
        borderRadius: borderRadius.small,
      }}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      data-testid="result-card-grid"
    >
      {isSelectedDataset && (
        <Box
          position="absolute"
          top={gap.lg}
          right={gap.lg}
          height="20px"
          width="auto"
          zIndex={1}
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

      <CardActionArea onClick={() => onClickCard(uuid)}>
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
          <CardActionArea onClick={() => onDetail(uuid)}>
            <Box
              display="flex"
              alignItems="center"
              arial-label="grid-list-card-title"
            >
              <Typography
                color={fontColor.gray.dark}
                fontSize={fontSize.resultCardContent}
                fontWeight={fontWeight.medium}
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
        <Stack direction="row" paddingX={padding.small}>
          <OrganizationLogo
            logo={findIcon()}
            sx={{
              width: "auto",
              maxWidth: "60px",
              height: "45px",
              paddingRight: padding.extraSmall,
            }}
          />
          <ResultCardButtonGroup
            content={content}
            onDownload={() => onDownload(uuid, "abstract", "download-section")}
            onDetail={() => onDetail(uuid)}
            onLink={() => onLink(uuid, "links")}
            shouldHideText
            isGridView
          />
        </Stack>
      )}
    </Card>
  );
};

export default GridResultCard;

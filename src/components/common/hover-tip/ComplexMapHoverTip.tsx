import { FC, useCallback } from "react";
import { OGCCollection } from "../store/OGCCollectionDefinitions";
import { Box, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import ResultCardButtonGroup from "../../result/ResultCardButtonGroup";
import Map from "../../map/mapbox/Map";
import Layers from "../../map/mapbox/layers/Layers";
import GeojsonLayer from "../../map/mapbox/layers/GeojsonLayer";
import BookmarkButton from "../../bookmark/BookmarkButton";
import { SEARCH_PAGE_REFERER } from "../../../pages/search-page/constants";
import { TabNavigation } from "../../../hooks/useTabNavigation";

interface BasicMapHoverTipProps {
  content?: string | undefined | null;
  sx?: SxProps;
  onDatasetSelected?: () => void;
  tabNavigation?: TabNavigation;
}

interface ComplexMapHoverTipProps extends BasicMapHoverTipProps {
  collection: OGCCollection;
}

const mapContainerId = "map-popup-spatial-extend-overview";

const ComplexMapHoverTip: FC<ComplexMapHoverTipProps> = ({
  collection,
  tabNavigation = () => {},
  sx,
}) => {
  const onLinks = useCallback(
    () => tabNavigation(collection.id, "links", SEARCH_PAGE_REFERER),
    [collection.id, tabNavigation]
  );
  const onDownload = useCallback(
    () => tabNavigation(collection.id, "abstract", "download-section"),
    [collection.id, tabNavigation]
  );
  const onDetail = useCallback(
    () => tabNavigation(collection.id, "abstract", SEARCH_PAGE_REFERER),
    [collection.id, tabNavigation]
  );

  return (
    <Box flex={1} sx={{ ...sx }}>
      <Stack direction="column" spacing={1}>
        <Box>
          <Tooltip title={collection.title} placement="top">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              height="60px"
            >
              <Typography
                fontWeight={fontWeight.bold}
                fontSize={fontSize.info}
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {collection.title}
              </Typography>
              <Box
                display="flex"
                alignItems="start"
                justifyContent="center"
                height="100%"
              >
                <BookmarkButton dataset={collection} />
              </Box>
            </Box>
          </Tooltip>
        </Box>
        <Box
          arial-label="map"
          id={`${mapContainerId}-${collection.id}`}
          sx={{
            width: "100%",
            height: "130px",
          }}
        >
          <Map panelId={`${mapContainerId}-${collection.id}`} animate={false}>
            <Layers>
              <GeojsonLayer collection={collection} />
            </Layers>
          </Map>
        </Box>
        <ResultCardButtonGroup
          content={collection}
          isGridView
          onLinks={onLinks}
          onDownload={onDownload}
          onDetail={onDetail}
        />
        <Box>
          <Tooltip title="More detail..." placement="top">
            <Typography
              color={fontColor.gray.medium}
              fontSize={fontSize.resultCardContent}
              sx={{
                padding: 0,
                paddingX: padding.small,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "5",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {collection.description}
            </Typography>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  );
};

export default ComplexMapHoverTip;

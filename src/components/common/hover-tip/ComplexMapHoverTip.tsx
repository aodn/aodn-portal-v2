import { FC, useCallback } from "react";
import { OGCCollection } from "../store/OGCCollectionDefinitions";
import { Box, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
  zIndex,
} from "../../../styles/constants";
import ResultCardButtonGroup from "../../result/ResultCardButtonGroup";
import Map from "../../map/mapbox/Map";
import Layers from "../../map/mapbox/layers/Layers";
import GeojsonLayer from "../../map/mapbox/layers/GeojsonLayer";
import BookmarkButton from "../../bookmark/BookmarkButton";
import { TabNavigation } from "../../../hooks/useTabNavigation";
import { detailPageDefault, pageReferer } from "../constants";

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
    () =>
      tabNavigation(
        collection.id,
        detailPageDefault.DATA_ACCESS,
        pageReferer.SEARCH_PAGE_REFERER
      ),
    [collection.id, tabNavigation]
  );
  const onDownload = useCallback(
    () =>
      tabNavigation(
        collection.id,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER
      ),
    [collection.id, tabNavigation]
  );
  const onDetail = useCallback(
    () =>
      tabNavigation(
        collection.id,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER
      ),
    [collection.id, tabNavigation]
  );

  return (
    <Box flex={1} sx={{ zIndex: zIndex.MAP_POPUP, ...sx }}>
      <Stack direction="column" spacing={1}>
        <Box position="relative">
          <Box position="absolute" top={-4} right={-4}>
            <BookmarkButton dataset={collection} />
          </Box>
          <Tooltip title={collection.title} placement="top">
            <Typography
              fontWeight={fontWeight.bold}
              fontSize={fontSize.label}
              sx={{
                padding: 0,
                width: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "5",
                WebkitBoxOrient: "vertical",
              }}
            >
              {collection.title}
            </Typography>
          </Tooltip>
        </Box>
        <Box
          arial-label="map"
          id={`${mapContainerId}-${collection.id}`}
          width="100%"
          height="130px"
        >
          <Map panelId={`${mapContainerId}-${collection.id}`}>
            <Layers>
              <GeojsonLayer collection={collection} animate={false} />
            </Layers>
          </Map>
        </Box>
        <ResultCardButtonGroup
          content={collection}
          isGridView
          onLinks={onLinks}
          onDownload={collection.hasSummaryFeature() ? onDownload : undefined}
          onDetail={onDetail}
        />
        <Box>
          <Typography
            color={fontColor.gray.medium}
            fontSize={fontSize.resultCardContent}
            sx={{
              padding: 0,
              paddingX: padding.small,
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordBreak: "break-word",
            }}
          >
            {collection.description}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default ComplexMapHoverTip;

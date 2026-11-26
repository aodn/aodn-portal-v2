import { FC, useCallback, useMemo, useRef } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { Box, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import {
  fontColor,
  fontSize,
  fontWeight,
  gap,
  padding,
  zIndex,
} from "@/styles/constants";
import ResultCardButtonGroup from "../../result/ResultCardButtonGroup";
import { ResultCardButtonSize } from "../buttons/ResultCardButton";
import Map from "../../map/mapbox/Map";
import Layers from "../../map/mapbox/layers/Layers";
import GeojsonLayer from "../../map/mapbox/layers/GeojsonLayer";
import BookmarkButton from "../../bookmark/BookmarkButton";
import { OpenType, TabNavigation } from "@/hooks/useTabNavigation";
import { detailPageDefault, pageReferer } from "../constants";
import FitToSpatialExtentsLayer from "../../map/mapbox/layers/FitToSpatialExtentsLayer";
import ContextMenu, { ContextMenuRef } from "../../menu/ContextMenu";
import useDownloadAvailability from "@/hooks/useDownloadAvailability";

interface BasicMapHoverTipProps {
  content?: string | undefined | null;
  sx?: SxProps;
  onDatasetSelected?: () => void;
  tabNavigation?: TabNavigation;
}

interface ComplexMapHoverTipProps extends BasicMapHoverTipProps {
  collection: OGCCollection;
  // Passed in because this tip renders in its own React root, where
  // AdminScreenContext is not available
  enableGeoServerWhiteList?: boolean;
}

const mapContainerId = "map-popup-spatial-extend-overview";

const ComplexMapHoverTip: FC<ComplexMapHoverTipProps> = ({
  collection,
  enableGeoServerWhiteList,
  tabNavigation = () => {},
  sx,
}) => {
  const menuRef = useRef<ContextMenuRef>(null);
  const collections = useMemo(() => [collection], [collection]);
  const isDownloadable = useDownloadAvailability(
    collections,
    enableGeoServerWhiteList
  );
  const onLinks = useCallback(
    (type: OpenType | undefined) =>
      tabNavigation(
        collection.id,
        detailPageDefault.DATA_ACCESS,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      ),
    [collection.id, tabNavigation]
  );
  const onDownload = useCallback(
    (type: OpenType | undefined) =>
      tabNavigation(
        collection.id,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      ),
    [collection.id, tabNavigation]
  );
  const onDetail = useCallback(
    (type: OpenType | undefined) =>
      tabNavigation(
        collection.id,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      ),
    [collection.id, tabNavigation]
  );

  return (
    <Box flex={1} sx={{ zIndex: zIndex.MAP_POPUP, ...sx }}>
      <Stack direction="column">
        <ContextMenu ref={menuRef} onClick={onDetail} />
        <Box
          position="relative"
          onContextMenu={(e) => menuRef.current?.openContextMenu(e)}
        >
          <Box position="absolute" sx={{ top: gap.sm, right: gap.md }}>
            <BookmarkButton dataset={collection} />
          </Box>
          <Tooltip title={collection.title} placement="top">
            <Typography
              fontWeight={fontWeight.bold}
              fontSize={fontSize.label}
              sx={{
                p: 0,
                pb: padding.extraSmall,
                width: "calc(100% - 36px)",
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
          aria-label="map"
          id={`${mapContainerId}-${collection.id}`}
          width="100%"
          height="130px"
        >
          <Map panelId={`${mapContainerId}-${collection.id}`}>
            <Layers>
              <FitToSpatialExtentsLayer collection={collection} />
              <GeojsonLayer
                collection={collection}
                animate={false}
                visible={true}
              />
            </Layers>
          </Map>
        </Box>
        <ResultCardButtonGroup
          content={collection}
          isGridView
          resultCardButtonConfig={{ size: ResultCardButtonSize.SMALL }}
          onLinks={onLinks}
          onDownload={isDownloadable(collection) ? onDownload : undefined}
          onDetail={onDetail}
        />
        <Box>
          <Typography
            color={fontColor.gray.medium}
            fontSize={fontSize.resultCardContent}
            sx={{
              width: "100%",
              padding: 0,
              paddingX: padding.small,
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitLineClamp: "9",
              WebkitBoxOrient: "vertical",
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

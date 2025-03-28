import { FC } from "react";
import { Box, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import Map from "../map/mapbox/Map";
import Layers from "../map/mapbox/layers/Layers";
import GeojsonLayer from "../map/mapbox/layers/GeojsonLayer";
import ResultCardButtonGroup from "../result/ResultCardButtonGroup";
import { fontColor, fontSize, padding } from "../../styles/constants";
import { SEARCH_PAGE_REFERER } from "../../pages/search-page/constants";
import { TabNavigation } from "../../hooks/useTabNavigation";
import { detailPageDefault } from "../common/constants";

export interface BookmarkListCardType {
  dataset: OGCCollection;
  tabNavigation?: TabNavigation;
}

interface BookmarkListCardProps extends BookmarkListCardType {
  sx?: SxProps;
}

const mapContainerId = "bookmark-list-map";

const BookmarkListCard: FC<BookmarkListCardProps> = ({
  dataset,
  tabNavigation = () => {},
  sx,
}) => {
  const onLinks = () =>
    tabNavigation(
      dataset.id,
      detailPageDefault.DATA_ACCESS,
      SEARCH_PAGE_REFERER
    );
  const onDownload = () =>
    tabNavigation(dataset.id, detailPageDefault.SUMMARY, SEARCH_PAGE_REFERER);
  const onDetail = () =>
    tabNavigation(dataset.id, detailPageDefault.SUMMARY, SEARCH_PAGE_REFERER);

  return (
    <Box flex={1} sx={{ ...sx }}>
      <Stack direction="column" spacing={1}>
        <Box
          arial-label="map"
          id={`${mapContainerId}-${dataset.id}`}
          sx={{
            width: "100%",
            height: "150px",
          }}
        >
          <Map panelId={`${mapContainerId}-${dataset.id}`}>
            <Layers>
              <GeojsonLayer collection={dataset} animate={false} />
            </Layers>
          </Map>
        </Box>

        <Box>
          <ResultCardButtonGroup
            content={dataset}
            isGridView
            onLinks={onLinks}
            onDownload={dataset.hasSummaryFeature() ? onDownload : undefined}
            onDetail={onDetail}
          />
        </Box>

        <Box onClick={() => {}}>
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
              {dataset.description}
            </Typography>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  );
};

export default BookmarkListCard;

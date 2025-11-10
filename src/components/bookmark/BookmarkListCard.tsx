import { FC, useCallback } from "react";
import { Box, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import Map from "../map/mapbox/Map";
import Layers from "../map/mapbox/layers/Layers";
import GeojsonLayer from "../map/mapbox/layers/GeojsonLayer";
import ResultCardButtonGroup from "../result/ResultCardButtonGroup";
import { padding } from "../../styles/constants";
import { TabNavigation } from "../../hooks/useTabNavigation";
import { detailPageDefault, pageReferer } from "../common/constants";
import rc8Theme from "../../styles/themeRC8";

export interface BookmarkListCardType {
  dataset: OGCCollection;
  tabNavigation?: TabNavigation;
}

interface BookmarkListCardProps extends BookmarkListCardType {
  sx?: SxProps;
}

const BookmarkListCard: FC<BookmarkListCardProps> = ({
  dataset,
  tabNavigation = () => {},
  sx,
}) => {
  const mapContainerId = `bookmark-list-map-${dataset.id}`;
  const handleNavigation = useCallback(
    (tab: string) => () =>
      tabNavigation(dataset.id, tab, pageReferer.SEARCH_PAGE_REFERER),
    [dataset.id, tabNavigation]
  );

  return (
    <Box sx={{ flex: 1, ...sx }}>
      <Stack direction="column" spacing={1}>
        <Box
          arial-label="map"
          id={mapContainerId}
          sx={{
            width: "100%",
            height: "150px",
          }}
        >
          <Map
            panelId={mapContainerId}
            announcement={
              dataset.getBBox() === undefined
                ? "model:Spatial information not available"
                : undefined
            }
          >
            <Layers>
              <GeojsonLayer
                collection={dataset}
                animate={false}
                visible={true}
              />
            </Layers>
          </Map>
        </Box>

        <ResultCardButtonGroup
          content={dataset}
          isGridView
          onLinks={handleNavigation(detailPageDefault.DATA_ACCESS)}
          onDownload={
            dataset.hasSummaryFeature()
              ? handleNavigation(detailPageDefault.SUMMARY)
              : undefined
          }
          onDetail={handleNavigation(detailPageDefault.SUMMARY)}
        />

        <Tooltip title="More detail..." placement="top">
          <Typography
            sx={{
              ...rc8Theme.typography.body3Small,
              color: rc8Theme.palette.grey700,
              fontWeight: 400,
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
      </Stack>
    </Box>
  );
};

export default BookmarkListCard;

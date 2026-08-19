import { FC, useCallback } from "react";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import Map from "@/components/map/mapbox/Map";
import Layers from "@/components/map/mapbox/layers/Layers";
import GeojsonLayer from "@/components/map/mapbox/layers/GeojsonLayer";
import ResultCardButtonGroup from "@/components/result/ResultCardButtonGroup";
import { padding } from "@/styles/constants";
import { OpenType, TabNavigation } from "@/hooks/useTabNavigation";
import { detailPageDefault, pageReferer } from "@/components/common/constants";
import { portalTheme } from "@/styles";
import FitToSpatialExtentsLayer from "@/components/map/mapbox/layers/FitToSpatialExtentsLayer";

export interface BookmarkListCardType {
  dataset: OGCCollection;
  tabNavigation?: TabNavigation;
}

interface BookmarkListCardProps extends BookmarkListCardType {
  sx?: SxProps;
}

const BookmarkListCard: FC<BookmarkListCardProps> = ({
  dataset,
  tabNavigation = undefined,
  sx,
}) => {
  const mapContainerId = `bookmark-list-map-${dataset.id}`;
  const handleNavigation = useCallback(
    (uuid: string, tab: string, type: OpenType | undefined) => {
      tabNavigation?.(
        uuid,
        tab,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      );
    },
    [tabNavigation]
  );

  return (
    <Box sx={{ flex: 1, ...sx }}>
      <Stack direction="column">
        <Box
          arial-label="map"
          id={mapContainerId}
          sx={{
            width: "100%",
            height: "276px",
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
              <FitToSpatialExtentsLayer collection={dataset} />
              <GeojsonLayer
                collection={dataset}
                animate={false}
                visible={true}
              />
            </Layers>
          </Map>
        </Box>

        <Box>
          <ResultCardButtonGroup
            content={dataset}
            isGridView
            onLinks={(type: OpenType | undefined) =>
              handleNavigation(dataset.id, detailPageDefault.DATA_ACCESS, type)
            }
            onDownload={
              dataset.hasCloudOptimisedData()
                ? (type: OpenType | undefined) =>
                    handleNavigation(
                      dataset.id,
                      detailPageDefault.SUMMARY,
                      type
                    )
                : undefined
            }
            onDetail={(type: OpenType | undefined) =>
              handleNavigation(dataset.id, detailPageDefault.SUMMARY, type)
            }
          />

          <Typography
            sx={{
              ...portalTheme.typography.body3Small,
              color: portalTheme.palette.text2,
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
        </Box>
      </Stack>
    </Box>
  );
};

export default BookmarkListCard;

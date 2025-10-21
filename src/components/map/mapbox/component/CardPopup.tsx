import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { TabNavigation } from "../../../../hooks/useTabNavigation";
import {
  fontColor,
  fontSize,
  fontWeight,
  gap,
  zIndex,
} from "../../../../styles/constants";
import MapContext from "../MapContext";
import { useAppDispatch } from "../../../common/store/hooks";
import { fetchResultByUuidNoStore } from "../../../common/store/searchReducer";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { MapEvent, MapMouseEvent } from "mapbox-gl";
import { Feature, Point } from "geojson";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import Map from "../Map";
import Layers from "../layers/Layers";
import GeojsonLayer from "../layers/GeojsonLayer";
import ResultCardButtonGroup from "../../../result/ResultCardButtonGroup";
import BookmarkButton from "../../../bookmark/BookmarkButton";
import { detailPageDefault, pageReferer } from "../../../common/constants";
import { MapEventEnum } from "../constants";

interface CardPopupProps {
  layerId: string;
  tabNavigation?: TabNavigation;
}

const mapContainerId = "card-popup-map-container";

const CardPopup: React.FC<CardPopupProps> = ({
  layerId,
  tabNavigation = () => {},
}) => {
  const { map } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const { isUnderLaptop, isTablet, isMobile } = useBreakpoint();
  const panel = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<OGCCollection>(new OGCCollection());

  const onLinks = useCallback(
    (collection: OGCCollection) =>
      tabNavigation(
        collection.id,
        detailPageDefault.DATA_ACCESS,
        pageReferer.SEARCH_PAGE_REFERER
      ),
    [tabNavigation]
  );
  const onDownload = useCallback(
    (collection: OGCCollection) =>
      tabNavigation(
        collection.id,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER
      ),
    [tabNavigation]
  );
  const onDetail = useCallback(
    (collection: OGCCollection) =>
      tabNavigation(
        collection.id,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER
      ),
    [tabNavigation]
  );

  const getCollectionData = useCallback(
    async (uuid: string) => {
      return dispatch(fetchResultByUuidNoStore(uuid))
        .unwrap()
        .then((collection: OGCCollection) => collection)
        .catch((error: any) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  useEffect(() => {
    const onMouseClick = (
      ev: Partial<MapMouseEvent & { targetLayerId: string }>
    ): void => {
      if (ev.target && map && panel && panel.current) {
        // Check if the layer exists before querying
        const style = map.getStyle();
        const layerExists = style.layers?.some((layer) => layer.id === layerId);
        if (!layerExists) {
          panel.current.style.visibility = "hidden";
          return;
        }

        if (ev.lngLat) {
          // Convert click coordinates to point for feature querying
          const point = map.project(ev.lngLat);
          // Query features from the specified layer at the clicked point
          const features = point
            ? map.queryRenderedFeatures(point, {
                layers: [ev.targetLayerId ?? layerId],
              })
            : [];

          // Check if we found any features at the clicked location
          if (features && features.length > 0) {
            const feature = features[0] as Feature<Point>;
            const uuid = feature?.properties?.uuid as string;

            if (uuid) {
              getCollectionData(uuid).then((collection) => {
                collection && setContent(collection);
              });
              panel.current.style.visibility = "visible";
            } else {
              panel.current.style.visibility = "hidden";
            }
          } else {
            // If no features found (i.e. click in empty space), hide the popup
            panel.current.style.visibility = "hidden";
          }
        }
      }
    };

    const onMouseMoved = (ev: MapEvent | undefined): void => {
      if (ev?.target && panel && panel.current) {
        panel.current.style.visibility = "hidden";
      }
    };

    const onSourceChange = (event: any) => {
      if (
        event.sourceId === layerId &&
        event.isSourceLoaded &&
        panel &&
        panel.current
      ) {
        panel.current.style.visibility = "hidden";
      }
    };

    if (isUnderLaptop) {
      map?.on(MapEventEnum.CLICK, onMouseClick);
      map?.on("moveend", onMouseMoved);
      // Handle case when move out of map without leaving popup box
      // then do a search
      map?.on("sourcedata", onSourceChange);
    }

    return () => {
      map?.off(MapEventEnum.CLICK, onMouseClick);
      map?.off("moveend", onMouseMoved);
      map?.off("sourcedata", onSourceChange);
    };
  }, [getCollectionData, isUnderLaptop, layerId, map]);

  return (
    <div
      id={"card-popup"}
      ref={panel}
      style={{
        display: "flex",
        visibility: "hidden",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        height: "100%",
        width: "100%",
        pointerEvents: "none", // Forward all event to behind
        zIndex: zIndex.MAP_POPUP,
      }}
    >
      <Card
        elevation={0}
        sx={{
          display: "flex",
          borderRadius: 0,
          marginTop: "auto",
          height: "auto",
          maxHeight: "50%",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          pointerEvents: "auto",
        }}
      >
        {isTablet && (
          <CardMedia
            component="div"
            id={mapContainerId}
            sx={{ position: "relative", height: "100%", width: "250px" }}
          >
            <Map
              panelId={mapContainerId}
              zoom={isUnderLaptop ? 1 : 2}
              animate={false}
            >
              <Layers>
                <GeojsonLayer collection={content} />
              </Layers>
            </Map>
          </CardMedia>
        )}
        <CardContent
          sx={{
            position: "relative",
            width: isTablet ? "calc(100% - 250px)" : "100%",
            height: "auto",
            maxHeight: "50%",
          }}
        >
          <Box position="absolute" sx={{ top: gap.md, right: gap.md }}>
            <BookmarkButton dataset={content} />
          </Box>
          <Typography
            fontWeight={fontWeight.bold}
            fontSize={isMobile ? fontSize.label : fontSize.info}
            sx={{
              width: "95%",
              padding: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "5",
              WebkitBoxOrient: "vertical",
            }}
          >
            {content?.title}
          </Typography>
          {isTablet && (
            <Typography
              color={fontColor.gray.medium}
              fontSize={fontSize.resultCardContent}
              sx={{
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "4",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {content?.description}
            </Typography>
          )}
          {content && (
            <ResultCardButtonGroup
              content={content}
              isGridView
              onLinks={() => onLinks(content)}
              onDownload={
                content.hasSummaryFeature()
                  ? () => onDownload(content)
                  : undefined
              }
              onDetail={() => onDetail(content)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardPopup;

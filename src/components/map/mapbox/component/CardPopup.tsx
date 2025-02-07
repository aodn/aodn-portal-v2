import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TabNavigation } from "../../../../hooks/useTabNavigation";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
  zIndex,
} from "../../../../styles/constants";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import MapContext from "../MapContext";
import { useAppDispatch } from "../../../common/store/hooks";
import { fetchResultByUuidNoStore } from "../../../common/store/searchReducer";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { MapboxEvent, MapLayerMouseEvent } from "mapbox-gl";
import { Feature, Point } from "geojson";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import Map from "../Map";
import Layers from "../layers/Layers";
import GeojsonLayer from "../layers/GeojsonLayer";
import ResultCardButtonGroup from "../../../result/ResultCardButtonGroup";
import { SEARCH_PAGE_REFERER } from "../../../../pages/search-page/constants";

interface CardPopupProps {
  layerId: string;
  tabNavigation?: TabNavigation;
}

const mapContainerId = "card-popup-map";

const CardPopup: React.FC<CardPopupProps> = ({
  layerId,
  tabNavigation = () => {},
}) => {
  const { map } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const { isUnderLaptop, isTablet } = useBreakpoint();
  const panel = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<OGCCollection>();

  const onLinks = useCallback(
    (collection: OGCCollection) =>
      tabNavigation(collection.id, "links", SEARCH_PAGE_REFERER),
    [tabNavigation]
  );
  const onDownload = useCallback(
    (collection: OGCCollection) =>
      tabNavigation(collection.id, "abstract", "download-section"),
    [tabNavigation]
  );
  const onDetail = useCallback(
    (collection: OGCCollection) =>
      tabNavigation(collection.id, "abstract", SEARCH_PAGE_REFERER),
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
    const onMouseClick = (ev: MapLayerMouseEvent): void => {
      if (ev.target && map && panel && panel.current) {
        if (ev.features && ev.features.length > 0) {
          const feature = ev.features[0] as Feature<Point>;
          const uuid = feature?.properties?.uuid as string;

          getCollectionData(uuid).then((collection) => {
            collection && setCollection(collection);
          });
          panel.current.style.visibility = "visible";
        } else {
          panel.current.style.visibility = "hidden";
        }
      }
    };

    const onMouseMoved = (
      ev: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
    ): void => {
      if (ev.target && panel && panel.current) {
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
      map?.on("click", layerId, onMouseClick);
      map?.on("moveend", onMouseMoved);
      // Handle case when move out of map without leaving popup box
      // then do a search
      map?.on("sourcedata", onSourceChange);
    }

    return () => {
      map?.off("click", layerId, onMouseClick);
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
        zIndex: zIndex["MAP_COORD"],
      }}
    >
      <Card
        elevation={0}
        sx={{
          display: "flex",
          borderRadius: 0,
          marginTop: "auto",
          height: "30%",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          pointerEvents: "auto",
        }}
      >
        <CardMedia
          component="div"
          id={`${mapContainerId}`}
          sx={{ height: "100%", width: "30%" }}
        >
          <Map
            panelId={`${mapContainerId}`}
            zoom={isUnderLaptop ? 1 : 2}
            animate={false}
          >
            <Layers>
              {collection && <GeojsonLayer collection={collection} />}
            </Layers>
          </Map>
        </CardMedia>
        <CardContent sx={{ width: "70%" }}>
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
            {collection?.title}
          </Typography>
          {isTablet && (
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
              {collection?.description}
            </Typography>
          )}
          {collection && (
            <ResultCardButtonGroup
              content={collection}
              isGridView
              onLinks={() => onLinks(collection)}
              onDownload={() => onDownload(collection)}
              onDetail={() => onDetail(collection)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardPopup;

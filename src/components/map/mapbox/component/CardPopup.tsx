import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TabNavigation } from "../../../../hooks/useTabNavigation";
import { fontSize, fontWeight, zIndex } from "../../../../styles/constants";
import { Card, CardContent, Typography } from "@mui/material";
import MapContext from "../MapContext";
import { useAppDispatch } from "../../../common/store/hooks";
import { fetchResultByUuidNoStore } from "../../../common/store/searchReducer";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { MapboxEvent, MapLayerMouseEvent } from "mapbox-gl";
import { Feature, Point } from "geojson";
import useBreakpoint from "../../../../hooks/useBreakpoint";

interface CardPopupProps {
  layerId: string;
  tabNavigation?: TabNavigation;
}

const CardPopup: React.FC<CardPopupProps> = ({ layerId, tabNavigation }) => {
  const { map } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const { isUnderLaptop } = useBreakpoint();
  const panel = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<OGCCollection | void>();

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
            setCollection(collection);
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
    isUnderLaptop && (
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
            borderRadius: 0,
            marginTop: "auto",
            height: "30%",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    )
  );
};

export default CardPopup;

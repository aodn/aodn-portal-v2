import React, {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  memo,
} from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import { MapEvent, MapMouseEvent, Popup } from "mapbox-gl";
import MapContext from "../MapContext";
import { Feature, Point } from "geojson";
import { fetchResultByUuidNoStore } from "../../../common/store/searchReducer";
import AppTheme from "../../../../utils/AppTheme";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import ComplexMapHoverTip from "../../../common/hover-tip/ComplexMapHoverTip";
import { TabNavigation } from "../../../../hooks/useTabNavigation";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import { isDrawModeRectangle } from "../../../../utils/MapUtils";

interface MapPopupProps {
  layerId: string;
  tabNavigation?: TabNavigation;
}
export interface MapPopupRef {
  forceRemovePopup: () => void;
}

interface PopupConfig {
  popupWidth: number;
  popupHeight: number;
}

const defaultPopupConfig: PopupConfig = {
  popupWidth: 250,
  popupHeight: 380,
};

const renderLoadingBox = ({ popupHeight, popupWidth }: PopupConfig) => (
  <Box
    sx={{
      transition: "opacity 0.2s ease-in-out",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: popupHeight,
      width: popupWidth,
    }}
  >
    <CircularProgress />
  </Box>
);

const MapPopup: React.FC<MapPopupProps> = memo(
  ({ layerId, tabNavigation }: MapPopupProps) => {
    const { map } = useContext(MapContext);
    const dispatch = useAppDispatch();
    const { isUnderLaptop } = useBreakpoint();

    // TODO: there is bug that map popup is not re-render for the interaction with bookmark button
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

    const renderContentBox = useCallback(
      (
        collection: null | OGCCollection,
        onMouseLeave: MouseEventHandler<HTMLDivElement>
      ) => {
        if (!collection) {
          return null;
        }

        return (
          <ThemeProvider theme={AppTheme}>
            <Card
              elevation={0}
              sx={{
                height: defaultPopupConfig.popupHeight,
                width: defaultPopupConfig.popupWidth,
                borderRadius: 0,
              }}
              onMouseLeave={onMouseLeave}
            >
              <CardContent
                sx={{
                  padding: 0,
                }}
              >
                <ComplexMapHoverTip
                  collection={collection}
                  tabNavigation={tabNavigation}
                />
              </CardContent>
            </Card>
          </ThemeProvider>
        );
      },
      [tabNavigation]
    );

    useEffect(() => {
      // Early return avoid not necessary setup
      if (!map || isUnderLaptop) return;

      const popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: "none",
        // Add 5px vertical offset for popup
        offset: [0, -5],
      });

      const container = document.createElement("div");
      const root = createRoot(container);

      const onPointMouseLeave = (event: MapMouseEvent) => {
        const element = popup.getElement();
        if (element) {
          const rect = element.getBoundingClientRect();
          // Use event.originalEvent.clientX / clientY for screen coordinates
          const mouseX = event.originalEvent.clientX;
          const mouseY = event.originalEvent.clientY;
          if (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
          ) {
            // Inside the popup, do nothing
          } else {
            popup.remove();
          }
        }
      };

      const onPopupMouseLeave = (_: React.MouseEvent<HTMLDivElement>) => {
        // When mouse leave the box we remove the popup
        popup.remove();
      };

      const onPointMouseEnter = (ev: MapMouseEvent) => {
        if (!ev.target || !map || isDrawModeRectangle(map)) return;

        ev.target.getCanvas().style.cursor = "pointer";
        if (ev.features && ev.features.length > 0) {
          // Copy coordinates array.
          const feature = ev.features[0] as Feature<Point>;
          const geometry = feature.geometry;
          const coordinates = geometry.coordinates.slice();

          // Render a loading state in the popup
          root.render(
            renderLoadingBox({
              popupHeight: defaultPopupConfig.popupHeight,
              popupWidth: defaultPopupConfig.popupWidth,
            })
          );

          const uuid = feature.properties?.uuid as string;
          getCollectionData(uuid).then((collection) => {
            if (collection) {
              root.render(renderContentBox(collection, onPopupMouseLeave));
              // Set the popup's position and content, then add it to the map
              // subscribe to close event to clean up resource.
              // Must show popup after data load, so that the position
              // calculate correctly
              popup
                .setLngLat(coordinates as [number, number])
                .setDOMContent(container)
                .addTo(map);
            }
          });
        }
      };

      const onSourceChange = (event: any) => {
        if (event.sourceId === layerId && event.isSourceLoaded) {
          popup.remove();
        }
      };

      const onMapMoveEndOrClick = (_: MapEvent | undefined) => {
        popup.remove();
      };

      // We do not need to show the MapPopup for small screen
      // without the event, the popup will not show but instance still
      // created, so when user enlarge the screen, this popup will work
      // automatically.
      map?.on("mouseleave", layerId, onPointMouseLeave);
      map?.on("mouseenter", layerId, onPointMouseEnter);

      map?.on("moveend", onMapMoveEndOrClick);
      // Handle case when move out of map without leaving popup box
      // then do a search
      map?.on("sourcedata", onSourceChange);

      return () => {
        map?.off("mouseleave", layerId, onPointMouseLeave);
        map?.off("mouseenter", layerId, onPointMouseEnter);

        map?.off("moveend", onMapMoveEndOrClick);
        map?.off("sourcedata", onSourceChange);
        popup?.remove();
        setTimeout(() => root?.unmount(), 500);
      };
    }, [getCollectionData, isUnderLaptop, layerId, map, renderContentBox]);

    return null;
  }
);
// ESLint require to have displayName
MapPopup.displayName = "MapPopup";
export default MapPopup;

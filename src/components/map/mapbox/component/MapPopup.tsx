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
import {
  fetchGeoServerDownloadLayers,
  fetchResultByUuidNoStore,
} from "@/app/store/searchReducer";
import AppTheme from "@/styles/theme";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { useAppDispatch } from "@/app/store/hooks";
import ComplexMapHoverTip from "../../../common/hover-tip/ComplexMapHoverTip";
import { TabNavigation } from "@/hooks/useTabNavigation";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import { isMapDrawModeActive } from "@/utils/MapUtils";
import { zIndex } from "@/styles/constants";
import AdminScreenContext from "@/components/admin/AdminScreenContext";
import { isDownloadableByLinks } from "@/hooks/useDownloadAvailability";

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
  popupWidth: 280,
  popupHeight: 390,
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
      zIndex: zIndex.MAP_POPUP,
    }}
  >
    <CircularProgress />
  </Box>
);

const MapPopup: React.FC<MapPopupProps> = memo(
  ({ layerId, tabNavigation }: MapPopupProps) => {
    const { map } = useContext(MapContext);
    // Same default as useDownloadAvailability
    const { enableGeoServerWhiteList = true } = useContext(AdminScreenContext);
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

    // The hover tip renders in its own React root without redux, so the WFS
    // check of useDownloadAvailability is done here
    const checkWfsLayers = useCallback(
      (uuid: string) =>
        dispatch(
          fetchGeoServerDownloadLayers({
            uuid,
            enableGeoServerWhiteList,
            skipRetries: true,
          })
        ),
      [dispatch, enableGeoServerWhiteList]
    );

    const renderContentBox = useCallback(
      (
        collection: null | OGCCollection,
        onMouseLeave: MouseEventHandler<HTMLDivElement>,
        isDownloadable: boolean
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
                zIndex: zIndex.MAP_POPUP,
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
                  isDownloadable={isDownloadable}
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
      // Of the dataset shown now, stopped when another one is hovered
      let wfsCheck: ReturnType<typeof checkWfsLayers> | undefined;

      const renderCollection = (collection: OGCCollection) => {
        const render = (isDownloadable: boolean) =>
          root.render(
            renderContentBox(collection, onPopupMouseLeave, isDownloadable)
          );
        const isKnown = isDownloadableByLinks(collection);
        render(isKnown ?? false);
        if (isKnown !== undefined) return;

        const check = checkWfsLayers(collection.id);
        wfsCheck = check;
        check
          .unwrap()
          .then((layers) => {
            if (layers.length > 0 && wfsCheck === check) render(true);
          })
          // Aborted, or failed and already logged: not downloadable
          .catch(() => {});
      };

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
        if (!ev.target || !map || isMapDrawModeActive(map)) return;

        ev.target.getCanvas().style.cursor = "pointer";
        if (ev.features && ev.features.length > 0) {
          // Copy coordinates array.
          const feature = ev.features[0] as Feature<Point>;
          const geometry = feature.geometry;
          const coordinates = geometry.coordinates.slice();

          wfsCheck?.abort();
          wfsCheck = undefined;
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
              popup.remove();
              renderCollection(collection);
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

      // Mapbox detaches the popup content from the DOM as soon as the popup is
      // removed, but the React tree stays mounted. Any portaled child (e.g. the
      // MUI tooltip on the title) would then lose its anchor.
      const onPopupClose = () => {
        wfsCheck?.abort();
        wfsCheck = undefined;
        root.render(null);
      };

      // We do not need to show the MapPopup for small screen
      // without the event, the popup will not show but instance still
      // created, so when user enlarge the screen, this popup will work
      // automatically.
      const onDrawInteractionChange = () => {
        if (isMapDrawModeActive(map)) {
          popup.remove();
        }
      };

      popup.on("close", onPopupClose);

      map?.on("mouseleave", layerId, onPointMouseLeave);
      map?.on("mouseenter", layerId, onPointMouseEnter);

      map?.on("moveend", onMapMoveEndOrClick);
      // Handle case when move out of map without leaving popup box
      // then do a search
      map?.on("sourcedata", onSourceChange);
      map?.on("draw.modechange", onDrawInteractionChange);
      map?.on("draw.selectionchange", onDrawInteractionChange);

      return () => {
        map?.off("mouseleave", layerId, onPointMouseLeave);
        map?.off("mouseenter", layerId, onPointMouseEnter);

        map?.off("moveend", onMapMoveEndOrClick);
        map?.off("sourcedata", onSourceChange);
        map?.off("draw.modechange", onDrawInteractionChange);
        map?.off("draw.selectionchange", onDrawInteractionChange);
        // Remove first so onPopupClose still unmounts the content, then detach
        popup?.remove();
        popup?.off("close", onPopupClose);
        setTimeout(() => root?.unmount(), 500);
      };
    }, [
      checkWfsLayers,
      getCollectionData,
      isUnderLaptop,
      layerId,
      map,
      renderContentBox,
    ]);

    return null;
  }
);
// ESLint require to have displayName
MapPopup.displayName = "MapPopup";
export default MapPopup;

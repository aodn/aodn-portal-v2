import {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import { MapLayerMouseEvent, Popup } from "mapbox-gl";
import MapContext from "../MapContext";
import { Feature, Point } from "geojson";
import { fetchResultByUuidNoStore } from "../../../common/store/searchReducer";
import AppTheme from "../../../../utils/AppTheme";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import ComplexMapHoverTip from "../../../common/hover-tip/ComplexMapHoverTip";
import { useSelector } from "react-redux";
import {
  addItem,
  selectBookmarkItems,
  selectTemporaryItem,
  setTemporaryItem,
} from "../../../common/store/bookmarkListReducer";

interface MapPopupProps {
  layerId: string;
  onDatasetSelected?: (uuid: Array<string>) => void;
  tabNavigation?: (uuid: string, tab: string, section?: string) => void;
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
  popupHeight: 370,
};

const popup = new Popup({
  closeButton: false,
  closeOnClick: false,
  maxWidth: "none",
  // Add 5px vertical offset for popup
  offset: [0, -5],
});

const renderLoadingBox = ({
  popupHeight,
  popupWidth,
}: {
  popupHeight: number;
  popupWidth: number;
}) => (
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

const handleDatasetSelect = (
  uuid: string,
  onDatasetSelected?: (uuid: Array<string>) => void
) => {
  if (onDatasetSelected) {
    onDatasetSelected([uuid]);
  }
};

const MapPopup: ForwardRefRenderFunction<MapPopupRef, MapPopupProps> = (
  { layerId, onDatasetSelected, tabNavigation },
  ref
) => {
  const { map } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const bookmarkItems = useSelector(selectBookmarkItems);
  const bookmarkTemporaryItem = useSelector(selectTemporaryItem);

  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);
  const [isMouseOverPopup, setIsMouseOverPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<ReactNode | null>(null);

  const checkIsBookmarked = useCallback(
    (uuid: string) => bookmarkItems?.some((item) => item.id === uuid),
    [bookmarkItems]
  );

  // TODO:need to expand accordion
  const onClickBookmark = useCallback(
    (item: OGCCollection) => {
      // If click on a temporaryItem
      console.log("click bookmark");
      if (bookmarkTemporaryItem && bookmarkTemporaryItem.id === item.id) {
        dispatch(setTemporaryItem(undefined));
        dispatch(addItem(item));
      } else {
        dispatch(addItem(item));
      }
    },
    [bookmarkTemporaryItem, dispatch]
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

  const renderContentBox = useCallback(
    (collection: void | OGCCollection) => {
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
            onMouseEnter={() => setIsMouseOverPopup(true)}
            onMouseLeave={() => setIsMouseOverPopup(false)}
          >
            <CardContent
              sx={{
                padding: 0,
              }}
            >
              <ComplexMapHoverTip
                collection={collection}
                onDatasetSelected={() =>
                  handleDatasetSelect(collection.id, onDatasetSelected)
                }
                tabNavigation={tabNavigation}
                checkIsBookmarked={checkIsBookmarked}
                onClickBookmark={onClickBookmark}
              />
            </CardContent>
          </Card>
        </ThemeProvider>
      );
    },
    [checkIsBookmarked, onClickBookmark, onDatasetSelected, tabNavigation]
  );

  const removePopup = useCallback(() => {
    if (!isMouseOverPoint && !isMouseOverPopup) {
      popup.remove();
      if (map) {
        map.getCanvas().style.cursor = "";
      }
      setPopupContent(null);
    }
  }, [isMouseOverPoint, isMouseOverPopup, map]);

  // Force remove the popup regardless of mouse position.
  const forceRemovePopup = useCallback(() => {
    popup.remove();
    if (map) {
      map.getCanvas().style.cursor = "";
    }
    setPopupContent(null);
    setIsMouseOverPoint(false);
    setIsMouseOverPopup(false);
  }, [map]);

  useImperativeHandle(ref, () => ({
    forceRemovePopup,
  }));

  // Delay the remove of popup for user move mouse into the popup when hover a point
  const onPointMouseLeave = useCallback(() => {
    setTimeout(() => setIsMouseOverPoint(false), 200);
    setTimeout(removePopup, 200);
  }, [removePopup]);

  const onPointMouseEnter = useCallback(
    async (ev: MapLayerMouseEvent): Promise<void> => {
      if (!ev.target || !map) return;

      setIsMouseOverPoint(true);
      ev.target.getCanvas().style.cursor = "pointer";

      if (ev.features && ev.features.length > 0) {
        // Copy coordinates array.
        const feature = ev.features[0] as Feature<Point>;
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates.slice();

        // Render a loading state in the popup
        setPopupContent(
          renderLoadingBox({
            popupHeight: defaultPopupConfig.popupHeight,
            popupWidth: defaultPopupConfig.popupWidth,
          })
        );

        // Set the popup's position and content, then add it to the map
        // subscribe to close event to clean up resource.
        popup
          .setLngLat(coordinates as [number, number])
          .setDOMContent(document.createElement("div"))
          .addTo(map);

        const uuid = feature.properties?.uuid as string;
        const collection = await getCollectionData(uuid);
        setPopupContent(renderContentBox(collection));
      }
    },
    [map, getCollectionData, renderContentBox]
  );

  useEffect(() => {
    map?.on("mouseleave", layerId, onPointMouseLeave);
    map?.on("mouseenter", layerId, onPointMouseEnter);

    return () => {
      map?.off("mouseleave", layerId, onPointMouseLeave);
      map?.off("mouseenter", layerId, onPointMouseEnter);
    };
  }, [map, layerId, onPointMouseEnter, onPointMouseLeave]);

  useEffect(() => {
    removePopup();
  }, [isMouseOverPoint, isMouseOverPopup, removePopup]);

  useEffect(() => {
    if (popupContent) {
      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(popupContent);
      popup.setDOMContent(container);

      // Important to free up resources, and must timeout to avoid race condition
      return () => {
        setTimeout(() => root.unmount(), 500);
      };
    }
  }, [popupContent]);

  return null;
};

export default forwardRef(MapPopup);

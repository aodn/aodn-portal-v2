import {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import { MapLayerMouseEvent, Popup } from "mapbox-gl";
import MapContext from "../MapContext";
import { Point, Feature } from "geojson";
import {
  fetchResultNoStore,
  SearchParameters,
} from "../../../common/store/searchReducer";
import AppTheme from "../../../../utils/AppTheme";
import {
  OGCCollection,
  OGCCollections,
} from "../../../common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import BasicMapHoverTip from "../../../common/hover-tip/BasicMapHoverTip";
import ComplexMapHoverTip from "../../../common/hover-tip/ComplexMapHoverTip";
import { pageDefault } from "../../../common/constants";
import { useNavigate } from "react-router-dom";

interface MapPopupProps {
  layerId: string;
  popupType?: PopupType;
  onDatasetSelected?: (uuid: Array<string>) => void;
  onNavigateToDetail?: (uuid: string) => void;
}
export interface MapPopupRef {
  forceRemovePopup: () => void;
}

export enum PopupType {
  Basic = "basic",
  Complex = "complex",
}

interface PopupConfig {
  popupWidth: number;
  popupHeight: number;
}

const defaultPopupConfig: Record<PopupType, PopupConfig> = {
  basic: {
    popupWidth: 250,
    popupHeight: 50,
  },
  complex: {
    popupWidth: 250,
    popupHeight: 370,
  },
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
  { layerId, onDatasetSelected, popupType = PopupType.Basic },
  ref
) => {
  const dispatch = useAppDispatch();
  const { map } = useContext(MapContext);
  const { popupHeight, popupWidth } = useMemo(
    () => defaultPopupConfig[popupType],
    [popupType]
  );
  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);
  const [isMouseOverPopup, setIsMouseOverPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<ReactNode | null>(null);
  const navigate = useNavigate();
  const onNavigateToDetailPage = useCallback(
    (uuid: string) => {
      const searchParams = new URLSearchParams();
      searchParams.append("uuid", uuid);
      navigate(pageDefault.details + "?" + searchParams.toString());
    },
    [navigate]
  );

  const getCollectionData = useCallback(
    async (uuid: string) => {
      const param: SearchParameters = {
        filter: `id='${uuid}'`,
      };

      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((value: OGCCollections) => value.collections[0])
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
              height: popupHeight,
              width: popupWidth,
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
              {popupType === PopupType.Basic && (
                <BasicMapHoverTip
                  content={collection?.title}
                  onDatasetSelected={() =>
                    handleDatasetSelect(collection.id, onDatasetSelected)
                  }
                  sx={{ height: popupHeight }}
                />
              )}
              {popupType === PopupType.Complex && (
                <ComplexMapHoverTip
                  collection={collection}
                  onNavigateToDetail={() =>
                    onNavigateToDetailPage(collection.id)
                  }
                  onDatasetSelected={() =>
                    handleDatasetSelect(collection.id, onDatasetSelected)
                  }
                />
              )}
            </CardContent>
          </Card>
        </ThemeProvider>
      );
    },
    [
      onDatasetSelected,
      onNavigateToDetailPage,
      popupHeight,
      popupType,
      popupWidth,
    ]
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
        setPopupContent(renderLoadingBox({ popupHeight, popupWidth }));

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
    [map, popupHeight, popupWidth, getCollectionData, renderContentBox]
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

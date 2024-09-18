import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchResultNoStore,
  SearchParameters,
} from "../../../common/store/searchReducer";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../utils/AppTheme";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { MapLayerMouseEvent, Popup } from "mapbox-gl";
import MapContext from "../MapContext";
import { Point, Feature } from "geojson";
import { createRoot, Root } from "react-dom/client";
import {
  OGCCollection,
  OGCCollections,
} from "../../../common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import BasicMapHoverTip from "../../../common/hover-tip/BasicMapHoverTip";
import ComplexMapHoverTip from "../../../common/hover-tip/ComplexMapHoverTip";

interface MapPopupProps {
  layerId: string;
  popupType?: PopupType;
  onDatasetSelected?: (uuid: Array<string>) => void;
}

export enum PopupType {
  Basic = "basic",
  Complex = "complex",
}

interface PopupConfig {
  width: number;
  height: number;
}

const defaultPopupConfig: Record<PopupType, PopupConfig> = {
  basic: {
    width: 250,
    height: 100,
  },
  complex: {
    width: 250,
    height: 500,
  },
};

const popup = new Popup({
  closeButton: false,
  closeOnClick: false,
  maxWidth: "none",
});

const renderLoadingBox = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => (
  <Box
    sx={{
      transition: "opacity 0.2s ease-in-out",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: height,
      width: width,
    }}
  >
    <CircularProgress />
  </Box>
);

const MapPopup: FC<MapPopupProps> = ({
  layerId,
  onDatasetSelected,
  popupType = PopupType.Basic,
}) => {
  const dispatch = useAppDispatch();
  const { map } = useContext(MapContext);
  const { height: popupHeight, width: popupWidth } = useMemo(
    () => defaultPopupConfig[popupType],
    [popupType]
  );
  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);
  const [isMouseOverPopup, setIsMouseOverPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode | null>(
    null
  );

  const getCollectionData = useCallback(
    async (uuid: string) => {
      const param: SearchParameters = {
        filter: `id='${uuid}'`,
        properties: "title,description",
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

  const contentBox = useCallback(
    (collection: void | OGCCollection) => (
      <ThemeProvider theme={AppTheme}>
        <Card
          elevation={0}
          sx={{ height: popupHeight, width: popupWidth }}
          onMouseEnter={() => setIsMouseOverPopup(true)}
          onMouseLeave={() => setIsMouseOverPopup(false)}
        >
          <CardActionArea
            onClick={() =>
              collection &&
              onDatasetSelected &&
              onDatasetSelected([collection.id])
            }
          >
            <CardContent>
              {popupType === PopupType.Basic && (
                <BasicMapHoverTip content={collection?.title} />
              )}
              {popupType === PopupType.Complex && <ComplexMapHoverTip />}
            </CardContent>
          </CardActionArea>
        </Card>
      </ThemeProvider>
    ),
    [onDatasetSelected, popupHeight, popupType, popupWidth]
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

  const onPointMouseLeave = useCallback(() => {
    setIsMouseOverPoint(false);
    setTimeout(removePopup, 100);
  }, [removePopup]);

  const onPointMouseEnter = useCallback(
    async (ev: MapLayerMouseEvent): Promise<void> => {
      if (!ev.target || !map) return;

      setIsMouseOverPoint(true);
      ev.target.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      if (ev.features && ev.features.length > 0) {
        const feature = ev.features[0] as Feature<Point>;
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates.slice();
        const uuid = feature.properties?.uuid as string;

        // Render a loading state in the popup
        setPopupContent(
          renderLoadingBox({ height: popupHeight, width: popupWidth })
        );

        // Set the popup's position and content, then add it to the map
        // subscribe to close event to clean up resource.
        popup
          .setLngLat(coordinates as [number, number])
          .setDOMContent(document.createElement("div"))
          .addTo(map);

        const collection = await getCollectionData(uuid);
        setPopupContent(contentBox(collection));
      }
    },
    [map, popupHeight, popupWidth, getCollectionData, contentBox]
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

export default MapPopup;

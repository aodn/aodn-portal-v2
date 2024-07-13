import React, { FC, useCallback, useContext, useEffect, useRef } from "react";
import {
  fetchResultNoStore,
  OGCCollection,
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
  Stack,
  Typography,
} from "@mui/material";
import { fontWeight } from "../../../../styles/constants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/store/store";
import { MapMouseEvent, Popup } from "mapbox-gl";
import MapContext from "../MapContext";
import { Point, Feature } from "geojson";
import { createRoot, Root } from "react-dom/client";

interface MapPopupProps {
  layerId: string;
  onClickPopup?: (uuid: string) => void;
}

const POPUP_WIDTH = "250px";
const POPUP_HEIGHT = "180px";

const popup = new Popup({
  closeButton: false,
  closeOnClick: false,
  maxWidth: "none",
});

const loadingBox = (
  <Box
    sx={{
      transition: "opacity 0.2s ease-in-out",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: POPUP_HEIGHT,
      width: POPUP_WIDTH,
    }}
  >
    <CircularProgress />
  </Box>
);

const MapPopup: FC<MapPopupProps> = ({ layerId, onClickPopup }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { map } = useContext(MapContext);

  const getCollectionData = useCallback(
    async (uuid: string) => {
      const param: SearchParameters = {
        filter: `id='${uuid}'`,
        properties: "title,description",
      };

      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((value) => value.collections[0])
        .catch((error) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  const contentBox = useCallback(
    (collection: void | OGCCollection) => (
      <ThemeProvider theme={AppTheme}>
        <Card elevation={0} sx={{ height: POPUP_HEIGHT, width: POPUP_WIDTH }}>
          <CardActionArea
            onClick={(event) =>
              collection && onClickPopup && onClickPopup(collection.id)
            }
          >
            <CardContent>
              <Stack
                direction="column"
                justifyContent="left"
                alignItems="center"
              >
                <Typography
                  fontWeight={fontWeight.bold}
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {collection?.title}
                </Typography>
                <Typography
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "4",
                    WebkitBoxOrient: "vertical",
                    maxWidth: "100%",
                  }}
                >
                  {collection?.description}
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </ThemeProvider>
    ),
    [onClickPopup]
  );

  const onPointMouseLeave = useCallback((ev: MapMouseEvent) => {
    ev.target.getCanvas().style.cursor = "";
    popup.remove();
  }, []);

  const onPointMouseEnter = useCallback(
    async (
      ev: MapMouseEvent,
      container: HTMLDivElement,
      root: Root
    ): Promise<void> => {
      if (!ev.target || !map) return;

      ev.target.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      if (ev.features && ev.features.length > 0) {
        const feature = ev.features[0] as Feature<Point>;
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates.slice();
        const uuid = feature.properties?.uuid as string;

        // Render a loading state in the popup
        root.render(loadingBox);

        // Set the popup's position and content, then add it to the map
        // subscribe to close event to clean up resource.
        popup
          .setLngLat(coordinates as [number, number])
          .setDOMContent(container)
          .addTo(map);

        // Fetch and render the actual content for the popup
        getCollectionData(uuid).then((collection) =>
          root.render(contentBox(collection))
        );
      }
    },
    [map, getCollectionData, contentBox]
  );

  useEffect(() => {
    const container = document.createElement("div");
    const root = createRoot(container);

    const mev = (ev: MapMouseEvent) => onPointMouseEnter(ev, container, root);

    map?.on("mouseleave", layerId, onPointMouseLeave);
    map?.on("mouseenter", layerId, mev);

    return () => {
      // Important to free up resources, and must timeout to avoid race condition
      setTimeout(() => root.unmount(), 500);

      map?.off("mouseleave", layerId, onPointMouseLeave);
      map?.off("mouseenter", layerId, mev);
    };
  }, [map, layerId, onPointMouseEnter, onPointMouseLeave]);

  return <React.Fragment />;
};

export default MapPopup;

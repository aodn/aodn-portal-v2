import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as turf from "@turf/turf";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { Feature, Polygon, Position } from "geojson";
import { LngLat, LngLatBounds, MapMouseEvent } from "mapbox-gl";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import { fitToBound } from "../../../../utils/MapUtils";
import bluePin from "@/assets/icons/blue_pin.png";
import { MapEventEnum } from "../constants";
import { TestHelper } from "../../../common/test/helper";

interface SpatialExtentPhoto {
  bbox: Position;
  url: string;
}
interface GeojsonLayerProps {
  // Vector tile layer should add to map
  collection: OGCCollection;
  onLayerClick?: (bounds: LngLatBounds) => void;
  onMouseEnter?: (event: MapMouseEvent) => void;
  onMouseLeave?: (event: MapMouseEvent) => void;
  onMouseMove?: (event: MapMouseEvent) => void;
  setPhotos?: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
  animate?: boolean;
  visible?: boolean;
}

const BLUE_PIN_NAME = "blue_pin_name";

const GeojsonLayer: FC<GeojsonLayerProps> = ({
  collection,
  onLayerClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  setPhotos,
  animate = false,
  visible = false,
}) => {
  const { map } = useContext(MapContext);
  const [_, setMapLoaded] = useState<boolean | null>(null);
  const extent = useMemo(() => collection.extent, [collection.extent]);
  const collectionId = useMemo(() => collection.id, [collection.id]);
  // Do not use memo on this, some case result in wrong id.
  const containerId = map?.getContainer().id;
  const sourceId = `geojson-${containerId}-source-${collectionId}`;

  const layerPolygonId = `geojson-${containerId}-layer-${collectionId}-poly`;
  const layerPointId = `geojson-${containerId}-layer-${collectionId}-point`;

  // Function to take photo of the map for given bounding boxes
  const takePhoto = useCallback(
    (bboxes: Array<Position> | undefined, index: number) => {
      if (!Array.isArray(bboxes) || !setPhotos) return;

      // when it comes to the last index, map fitBound to the first bbox (the overall bbox)
      if (bboxes.length === index) {
        fitToBound(map, bboxes[0], { animate });
        return;
      }

      // before the last bbox snapshot has been taken, map will fit to current bounding box
      const bound = bboxes[index];
      if (map) {
        fitToBound(map, bound, {
          animate: animate,
        });

        map.once("idle", () => {
          // get canvas and store in state photos[] after fitBounds completed
          const canvas = map.getCanvas();
          canvas?.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setPhotos((prevPhotos) => [
                ...prevPhotos,
                {
                  bbox: bound,
                  url: url,
                },
              ]);
            } else {
              console.error("Error creating blob from canvas");
            }
          }, "image/png");
          // increase the index to loop
          takePhoto(bboxes, index + 1);
        });
      }
    },
    [map, animate, setPhotos]
  );

  const handleIdle = useCallback(
    (bboxes: Array<Position> | undefined) => {
      if (bboxes === undefined) return;

      // If Layer didn't receive the setPhoto as a prop, it means no need to take photos for every bbox, therefore just call fitToOverallBbox
      if (setPhotos) {
        //  Resets the photos state and initiates the photo-taking process for the provided bounding boxes.
        setPhotos((prevPhotos) => {
          prevPhotos.forEach((prevPhoto) => {
            URL.revokeObjectURL(prevPhoto.url); // Cleanup the URL
          });
          return [];
        });
        // Call takePhoto with the bounding boxes and starts with the first bounding box (index set to 0)
        takePhoto(bboxes, 0);
      }
    },
    [setPhotos, takePhoto]
  );

  const handleLayerClick = useCallback(
    (event: MapMouseEvent) => {
      if (!map || !onLayerClick) return;
      try {
        const point = map.project(event.lngLat);
        const features = map.queryRenderedFeatures(point, {
          layers: [layerPolygonId],
        });
        if (features && features.length > 0) {
          const feature = features[0] as Feature<Polygon>;
          const featureBbox = turf.bbox(feature);
          if (featureBbox && featureBbox.length === 4) {
            const bounds = new LngLatBounds(
              new LngLat(featureBbox[0], featureBbox[1]), // SW
              new LngLat(featureBbox[2], featureBbox[3]) // NE
            );
            onLayerClick(bounds);
          }
        }
      } catch (error) {
        console.error("Error handling layer click:", error);
      }
    },
    [map, onLayerClick, layerPolygonId]
  );

  const createLayer = useCallback(() => {
    // If style changed, we may need to add the layer again, hence listen to this event.
    // https://github.com/mapbox/mapbox-gl-js/issues/8660
    //
    if (map?.getSource(sourceId)) return true;

    map?.addSource(sourceId, {
      type: "geojson",
      // Use a URL for the value for the `data` property.
      data: extent?.getGeojsonFromBBox(1),
    });

    map?.addLayer({
      id: layerPolygonId,
      type: "fill",
      source: sourceId,
      filter: ["!=", ["geometry-type"], "Point"],
      paint: {
        "fill-color": stringToColor(collectionId),
        "fill-outline-color": "yellow",
      },
      layout: {
        visibility: visible ? "visible" : "none",
      },
    });

    map?.addLayer({
      id: layerPointId,
      type: "symbol",
      source: sourceId,
      filter: ["==", ["geometry-type"], "Point"],
      layout: {
        visibility: visible ? "visible" : "none",
        "icon-image": BLUE_PIN_NAME,
      },
    });
  }, [
    map,
    sourceId,
    extent,
    layerPolygonId,
    collectionId,
    visible,
    layerPointId,
  ]);

  // This is use to handle base map change that set style will default remove all layer, which is
  // the behavior of mapbox, this useEffect, add the layer back based on user event
  useEffect(() => {
    map?.on("styledata", createLayer);
    return () => {
      map?.off("styledata", createLayer);
    };
  }, [map, createLayer]);

  useEffect(() => {
    if (!map || !map.getLayer(layerPolygonId) || !map.getLayer(layerPointId))
      return;

    map.setLayoutProperty(
      layerPolygonId,
      "visibility",
      visible ? "visible" : "none"
    );
    map.setLayoutProperty(
      layerPointId,
      "visibility",
      visible ? "visible" : "none"
    );
  }, [map, layerPolygonId, visible, layerPointId]);

  useEffect(() => {
    if (map === null) return;

    // Order important we want to load the image first
    map?.once(MapEventEnum.IDLE, () => {
      map?.loadImage(bluePin, (err, img) => {
        if (!err && img && !map?.hasImage(BLUE_PIN_NAME))
          map.addImage(BLUE_PIN_NAME, img);
      });
    });

    // This situation is map object created, hence not null, but not completely loaded
    // therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    map?.once(MapEventEnum.IDLE, () =>
      setMapLoaded((prev) => {
        if (!prev) {
          createLayer();
          // Call handleIdle when the map is idle
          const onceIdle = () => handleIdle(extent?.bbox);
          map?.once("idle", onceIdle);
          map?.on("click", layerPolygonId, handleLayerClick);
          if (onMouseEnter) map?.on("mouseenter", layerPolygonId, onMouseEnter);
          if (onMouseLeave) map?.on("mouseleave", layerPolygonId, onMouseLeave);
          if (onMouseMove) map?.on("mousemove", layerPolygonId, onMouseMove);

          return true;
        } else return prev;
      })
    );

    return () => {
      // Always remember to clean up resources
      try {
        if (map?.getSource(sourceId)) {
          map?.removeLayer(layerPolygonId);
          map?.removeLayer(layerPointId);
          map?.removeSource(sourceId);
          map?.removeImage(BLUE_PIN_NAME);
        }
      } catch (error) {
        // OK to ignore error here
      } finally {
        map?.off("click", layerPolygonId, handleLayerClick);
        if (onMouseEnter) map?.off("mouseenter", layerPolygonId, onMouseEnter);
        if (onMouseLeave) map?.off("mouseleave", layerPolygonId, onMouseLeave);
        if (onMouseMove) map?.off("mousemove", layerPolygonId, onMouseMove);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, handleIdle, layerPolygonId, sourceId]);

  return (
    <TestHelper
      id={map?.getContainer().id || ""}
      getSpatialExtentLayer={() => layerPolygonId}
    />
  );
};

export default GeojsonLayer;

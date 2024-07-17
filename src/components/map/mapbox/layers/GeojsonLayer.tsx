import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { SpatialExtentPhoto } from "../../../../pages/detail-page/context/detail-page-context";
import { Position } from "geojson";
import mapboxgl, { LngLatBoundsLike } from "mapbox-gl";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";

interface GeojsonLayerProps {
  // Vector tile layer should added to map
  collection: OGCCollection;
  setPhotos?: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
}

const GeojsonLayer: FC<GeojsonLayerProps> = ({ collection, setPhotos }) => {
  const { map } = useContext(MapContext);
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);
  const extent = useMemo(() => collection.extent, [collection.extent]);
  const collectionId = useMemo(() => collection.id, [collection.id]);

  // Function to fit map to the overall bbox(bboxes[0])
  const fitToOverallBbox = useCallback(
    (bboxes: Array<Position>) => {
      const bound = bboxes[0] as LngLatBoundsLike;
      map?.fitBounds(bound, { maxZoom: 3, padding: 10 });
    },
    [map]
  );

  // Function to take photo of the map for given bounding boxes
  const takePhoto = useCallback(
    (bboxes: Array<Position> | undefined, index: number) => {
      if (!Array.isArray(bboxes) || !setPhotos) return;

      // when it comes to the last index, map fitBound to the first bbox (the overall bbox)
      if (bboxes.length === index) {
        fitToOverallBbox(bboxes);
        return;
      }

      // before the last bbox snapshot has been taken (i.e. index < bboxes.length), map will fitBound to current bounding box (bboxes[index]) to get a snapshot once idle
      const bound = bboxes[index] as LngLatBoundsLike;
      const bbox = bboxes[index];
      const m = map?.fitBounds(bound, {
        maxZoom: index === 0 ? 2 : 5,
        padding: 10,
        animate: false,
      });
      m?.once("idle", () => {
        // get canvas and store in state photos[] after fitBounds completed
        const canvas = m?.getCanvas();
        canvas?.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPhotos((prevPhotos) => [
              ...prevPhotos,
              {
                bbox,
                url,
              },
            ]);
          } else {
            console.error("Error creating blob from canvas");
          }
        }, "image/png");
        // increase the index to loop
        takePhoto(bboxes, index + 1);
      });
    },
    [fitToOverallBbox, map, setPhotos]
  );

  const handleIdle = useCallback(
    (bboxes: Array<Position> | undefined) => {
      if (bboxes === undefined) return;

      // If Layer didn't receive the setPhoto as a prop, it means no need to take photos for every bbox, therefore just call fitToOverallBbox
      if (!setPhotos) {
        fitToOverallBbox(bboxes);
        return;
      }

      //  Resets the photos state and initiates the photo-taking process for the provided bounding boxes.
      setPhotos((prevPhotos) => {
        prevPhotos.forEach((prevPhoto) => {
          URL.revokeObjectURL(prevPhoto.url); // Cleanup the URL
        });
        return [];
      });
      // Call takePhoto with the bounding boxes and starts with the first bounding box (index set to 0)
      takePhoto(bboxes, 0);
    },
    [fitToOverallBbox, setPhotos, takePhoto]
  );

  const createLayer = useCallback(() => {
    const sourceId = `geojson-${map?.getContainer().id}-source-${collectionId}`;
    const layerId = `geojson-${map?.getContainer().id}-layer-${collectionId}`;

    // If style changed, we may need to add the layer again, hence listen to this event.
    // https://github.com/mapbox/mapbox-gl-js/issues/8660
    //
    if (map?.getSource(sourceId)) return true;

    map?.addSource(sourceId, {
      type: "geojson",
      // Use a URL for the value for the `data` property.
      data: extent?.getGeojsonExtents(1),
    });

    map?.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": stringToColor(collectionId),
        "fill-outline-color": "black",
      },
    });
  }, [map, extent, collectionId]);

  // This is use to handle base map change that set style will default remove all layer, which is
  // the behavior of mapbox, this useEffect, add the layer back based on user event
  useEffect(() => {
    map?.on("styledata", createLayer);
    return () => {
      map?.off("styledata", createLayer);
    };
  }, [map, createLayer]);

  useEffect(() => {
    if (map === null) return;

    // This situation is map object created, hence not null, but not completely loaded
    // and therefore you will have problem setting source and layer. Set-up a listener
    // to update the state and then this effect can be call again when map loaded.
    map?.once("load", () =>
      setMapLoaded((prev) => {
        if (!prev) {
          createLayer();
          // Call handleIdle when the map is idle
          const onceIdle = () => handleIdle(extent?.bbox);
          map?.once("idle", onceIdle);

          return true;
        } else return prev;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, handleIdle]);

  return <React.Fragment />;
};

export default GeojsonLayer;

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
import { OGCCollection } from "../../../common/store/searchReducer";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { SpatialExtentPhoto } from "../../../../pages/detail-page/context/detail-page-context";
import { Position } from "geojson";
import { LngLatBoundsLike } from "mapbox-gl";

interface GeojsonLayerProps {
  // Vector tile layer should added to map
  collection: OGCCollection;
  setPhotos?: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
}

const GeojsonLayer: FC<GeojsonLayerProps> = ({ collection, setPhotos }) => {
  const { map } = useContext(MapContext);
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);
  const extent = useMemo(() => collection.extent, [collection.extent]);

  // Function to take photo of the map for given bounding boxes
  const takePhoto = useCallback(
    (bboxes: Array<Position> | undefined, index: number) => {
      if (!Array.isArray(bboxes) || !setPhotos) return;

      // after the last bbox snapshot was taken, map fitBound to the first bbox (the overall bbox)
      if (bboxes.length === index) {
        const bound = bboxes[0] as LngLatBoundsLike;
        map?.fitBounds(bound, { maxZoom: 3, padding: 10 });
        return;
      }

      // before the last bbox snapshot has been taken, map will fitBound to current bounding box (bboxes[index]) to get a snapshot once idle
      const bound = bboxes[index] as LngLatBoundsLike;
      const bbox = bboxes[index];
      const m = map?.fitBounds(bound, {
        maxZoom: index === 0 ? 3 : 5,
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
        takePhoto(bboxes, index + 1);
      });
    },
    [map, setPhotos]
  );

  //  Resets the photos state and initiates the photo-taking process for the provided bounding boxes.
  const takeSnapshot = useCallback(
    (bboxes: Array<Position> | undefined) => {
      if (!setPhotos || bboxes === undefined) return;
      // clears the existing photos in the setPhotos state by revoking the URLs of the previous photos and setting the state to an empty array.
      setPhotos((prevPhotos) => {
        prevPhotos.forEach((prevPhoto) => {
          URL.revokeObjectURL(prevPhoto.url); // Cleanup the URL
        });
        return [];
      });
      //calls takePhoto with the bounding boxes and starts with the first bounding box (index set to 0)
      takePhoto(bboxes, 0);
    },
    [setPhotos, takePhoto]
  );

  useEffect(() => {
    if (map === null) return;

    const sourceId = `geojson-source-layer-${collection.id}`;
    const layerId = `geojson-layer-${collection.id}`;

    if (mapLoaded === null) {
      // This situation is map object created, hence not null, but not completely loaded
      // and therefore you will have problem setting source and layer. Set-up a listener
      // to update the state and then this effect can be call again when map loaded.
      map?.on("load", () =>
        setMapLoaded((prev) => {
          if (!prev) {
            // If style changed, we may need to add the layer again, hence listen to this event.
            // https://github.com/mapbox/mapbox-gl-js/issues/8660
            //
            // We take the maploaded event and setup the listener and return value at once.

            map.addSource(sourceId, {
              type: "geojson",
              // Use a URL for the value for the `data` property.
              data: extent?.getGeojsonExtents(1),
            });

            map.addLayer({
              id: layerId,
              type: "fill",
              source: sourceId,
              paint: {
                "fill-color": stringToColor(collection.id),
                "fill-outline-color": "black",
              },
            });
            return true;
          } else return prev;
        })
      );
    }

    // Take a snapshot when the map is idle
    const handleIdle = () => takeSnapshot(extent?.bbox);
    map?.once("idle", handleIdle);

    // Clean up map sources and layers when the component unmounts or map unloads
    map?.on("unload", () => {
      if (map?.getSource(sourceId)) {
        map?.removeSource(sourceId);
        map?.removeLayer(layerId);
      }
    });

    return () => {
      map?.off("idle", handleIdle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.id, map, mapLoaded, setPhotos, takeSnapshot]);

  return <React.Fragment />;
};

export default GeojsonLayer;

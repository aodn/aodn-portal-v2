import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { OGCCollection } from "../../../common/store/searchReducer";
import MapContext from "../MapContext";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { SpatialExtentPhoto } from "../../../../pages/detail-page/context/detail-page-context";
import { Position } from "geojson";
import { LngLat, LngLatBoundsLike } from "mapbox-gl";

interface GeojsonLayerProps {
  // Vector tile layer should added to map
  collection: OGCCollection;
  setPhotos?: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
}

const GeojsonLayer: FC<GeojsonLayerProps> = ({ collection, setPhotos }) => {
  const { map } = useContext(MapContext);
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);
  console.log({ collection });

  const takePhoto = useCallback(
    (bboxes: Array<Position> | undefined, index: number) => {
      if (!Array.isArray(bboxes) || !setPhotos) return;
      if (bboxes.length === index) return;
      const bound = bboxes[index] as LngLatBoundsLike;
      const bbox = bboxes[index];
      const m = map?.fitBounds(bound, {
        maxZoom: 5,
        padding: 50,
        animate: false,
      });
      m?.once("idle", () => {
        // Place your code here that should run after fitBounds completes
        const canvas = m?.getCanvas();
        canvas?.toBlob((blob) => {
          if (blob) {
            console.log("fitBounds has completed.");
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

  const takeSnapshot = useCallback(
    (bboxes: Array<Position> | undefined) => {
      if (!setPhotos || bboxes === undefined) return;
      setPhotos((prevPhotos) => {
        prevPhotos.forEach((prevPhoto) => {
          URL.revokeObjectURL(prevPhoto.url); // Cleanup the URL
        });
        return [];
      });
      // const bboxesArr = [
      //   [112, -33, 115, -30],
      //   [150, -33, 115, -30],
      //   [90, -33, 115, -30],
      //   [50, -33, 115, -30],
      // ];
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
            console.log("add source??????????????");
            map.addSource(sourceId, {
              type: "geojson",
              // Use a URL for the value for the `data` property.
              data: collection.extent?.getGeojsonExtents(),
            });
            console.log(
              "in add layer",
              JSON.stringify(collection.extent?.getGeojsonExtents())
            );
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

    const handleIdle = () => takeSnapshot(collection.extent?.bbox);
    map?.once("idle", handleIdle);

    map?.on("unload", () => {
      if (map?.getSource(sourceId)) {
        map?.removeSource(sourceId);
        map?.removeLayer(layerId);
      }
    });

    return () => {
      map?.off("idle", handleIdle);
    };
  }, [
    collection.extent,
    collection.id,
    map,
    mapLoaded,
    setPhotos,
    takeSnapshot,
  ]);

  return <React.Fragment />;
};

export default GeojsonLayer;

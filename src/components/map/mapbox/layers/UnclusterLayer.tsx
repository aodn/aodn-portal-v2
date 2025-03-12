import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import { GeoJSONSource } from "mapbox-gl";
import MapPopup from "../component/MapPopup";
import {
  defaultMouseEnterEventHandler,
  defaultMouseLeaveEventHandler,
  findSuitableVisiblePoint,
  LayerBasicType,
} from "./Layers";
import SpatialExtents from "../component/SpatialExtents";
import { FeatureCollection, Point } from "geojson";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import { generateFeatureCollectionFrom } from "../../../../utils/GeoJsonUtils";
import CardPopup from "../component/CardPopup";

interface UnclusterLayerConfig {
  unclusterPointColor: string;
  unclusterPointOpacity: number;
  unclusterPointStrokeWidth: number;
  unclusterPointStrokeColor: string;
  unclusterPointRadius: number;
}

interface UnclusterLayerProps extends LayerBasicType {
  // Some method inherit from LayerBasicType
  unclusterLayerConfig?: Partial<UnclusterLayerConfig>;
}

const defaultUnclusterLayerConfig: UnclusterLayerConfig = {
  unclusterPointColor: "#51bbd6",
  unclusterPointOpacity: 1,
  unclusterPointStrokeWidth: 1,
  unclusterPointStrokeColor: "#fff",
  unclusterPointRadius: 8,
};

const getLayerId = (id: string | undefined) => `uncluster-layer-${id}`;
const getUnclusterSourceId = (layerId: string) =>
  `${layerId}-uncluster-layer-source`;

const getUnclusterLayerId = (layerId: string) =>
  `${layerId}-uncluster-layer-point`;

const UnclusterLayer: FC<UnclusterLayerProps> = ({
  featureCollection = generateFeatureCollectionFrom(undefined),
  selectedUuids,
  onClickMapPoint: onDatasetSelected,
  tabNavigation,
  unclusterLayerConfig,
}: UnclusterLayerProps) => {
  const { map } = useContext(MapContext);
  const [_, setLastVisiblePoint] = useState<
    FeatureCollection<Point> | undefined
  >(undefined);

  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);
  const unclusterSourceId = useMemo(
    () => getUnclusterSourceId(layerId),
    [layerId]
  );
  const unclusterLayerId = useMemo(
    () => getUnclusterLayerId(layerId),
    [layerId]
  );

  useEffect(() => {
    if (map === null) return;

    const createLayers = () => {
      if (map?.getSource(unclusterSourceId)) return;

      const config = mergeWithDefaults(
        defaultUnclusterLayerConfig,
        unclusterLayerConfig
      );

      map?.addSource(unclusterSourceId, {
        type: "geojson",
        data: findSuitableVisiblePoint(
          generateFeatureCollectionFrom(undefined),
          map
        ),
        cluster: false,
      });

      map?.addLayer({
        id: unclusterLayerId,
        type: "circle",
        source: unclusterSourceId,
        paint: {
          "circle-opacity": config.unclusterPointOpacity,
          "circle-color": config.unclusterPointColor,
          "circle-radius": config.unclusterPointRadius,
          "circle-stroke-width": config.unclusterPointStrokeWidth,
          "circle-stroke-color": config.unclusterPointStrokeColor,
        },
      });

      map?.on("mouseenter", unclusterLayerId, defaultMouseEnterEventHandler);
      map?.on("mouseleave", unclusterLayerId, defaultMouseLeaveEventHandler);
    };

    map?.once("load", createLayers);
    map?.on("styledata", createLayers);

    return () => {
      map?.off("mouseenter", unclusterLayerId, defaultMouseEnterEventHandler);
      map?.off("mouseleave", unclusterLayerId, defaultMouseLeaveEventHandler);

      try {
        if (map?.getLayer(unclusterLayerId)) map?.removeLayer(unclusterLayerId);
      } catch (error) {
        // If source not found and throw exception then layer will not exist
        // TODO: handle error in ErrorBoundary
      }
    };
    // Make sure map is the only dependency so that it will not trigger twice run
    // where you will add source and remove layer accidentally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const updateSource = useCallback(() => {
    if (map?.getSource(unclusterSourceId)) {
      setLastVisiblePoint((p) => {
        const newData = findSuitableVisiblePoint(featureCollection, map, p);

        (map?.getSource(unclusterSourceId) as GeoJSONSource).setData(newData);
        return newData;
      });
    }
  }, [map, unclusterSourceId, featureCollection]);

  useEffect(() => {
    updateSource();
    map?.on("styledata", updateSource);
    return () => {
      map?.off("styledata", updateSource);
    };
  }, [map, updateSource]);

  return (
    <>
      <MapPopup layerId={unclusterLayerId} tabNavigation={tabNavigation} />
      <CardPopup layerId={unclusterLayerId} tabNavigation={tabNavigation} />
      <SpatialExtents
        layerId={unclusterLayerId}
        selectedUuids={selectedUuids}
        addedLayerIds={[unclusterLayerId]}
        onDatasetSelected={onDatasetSelected}
      />
    </>
  );
};

export default UnclusterLayer;

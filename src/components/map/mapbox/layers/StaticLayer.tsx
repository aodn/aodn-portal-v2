import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MapContext from "../MapContext";
import { FeatureCollection } from "geojson";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { TestHelper } from "../../../common/test/helper";

// Data download from here
// https://data.gov.au/dataset/ds-dcceew-https%3A%2F%2Fwww.arcgis.com%2Fhome%2Fitem.html%3Fid%3D2b3eb1d42b8d4319900cf4777f0a83b9%26sublayer%3D0/details?q=marine%20park
import ampJson from "./data/Australian_Marine_Parks.json";

export interface StaticLayersProps {
  id: string;
  name: string;
  label: string;
  features: FeatureCollection;
}

const StaticLayersDef = {
  AUSTRALIA_MARINE_PARKS: {
    id: "static-australia-marine-parks",
    name: "Australia Marine Parks",
    label: "RESNAME",
  },
};

const StaticLayer: FC<StaticLayersProps> = ({ id, name, label, features }) => {
  const { map } = useContext(MapContext);
  const [created, setCreated] = useState<boolean>(false);
  const sourceId = useMemo(
    () => `static-geojson-${map?.getContainer().id}-source-${id}`,
    [id, map]
  );
  const layerId = useMemo(
    () => `static-geojson-${map?.getContainer().id}-layer-${id}`,
    [id, map]
  );
  const layerLabelId = useMemo(
    () => `static-geojson-${map?.getContainer().id}-label-${id}`,
    [id, map]
  );

  const createLayer = useCallback(() => {
    if (map?.getSource(sourceId)) return true;

    map?.addSource(sourceId, {
      type: "geojson",
      // Use a URL for the value for the `data` property.
      data: features,
    });

    map?.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": stringToColor(id),
        "fill-outline-color": "black",
      },
    });

    // Add a symbol layer to display the names
    map?.addLayer({
      id: layerLabelId,
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", label],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "symbol-placement": "point",
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#000000",
        "text-halo-width": 2,
      },
    });
  }, [map, layerId, sourceId, layerLabelId, features, id, label]);

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

    // Only create once, the strict mode cause twice call.
    setCreated((value) => {
      if (!value) createLayer();
      return true;
    });

    return () => {
      // Always remember to clean up resources
      try {
        if (map?.getSource(sourceId)) {
          map?.removeLayer(layerLabelId);
          map?.removeLayer(layerId);
          map?.removeSource(sourceId);
        }
      } catch (error) {
        // OK to ignore error here
      }
    };
  }, [map, createLayer, layerId, sourceId, layerLabelId]);

  return id === StaticLayersDef.AUSTRALIA_MARINE_PARKS.id ? (
    <TestHelper getAUMarineParksLayer={() => layerId} />
  ) : (
    <React.Fragment />
  );
};
// A shortcut for australia marine parks
const AustraliaMarineParkLayer: FC<Partial<StaticLayersProps>> = ({
  id = StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
  name = StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
  label = StaticLayersDef.AUSTRALIA_MARINE_PARKS.label,
  features = ampJson as FeatureCollection,
}) => <StaticLayer id={id} name={name} label={label} features={features} />;
// Export needed layers
export { AustraliaMarineParkLayer, StaticLayersDef };

export default StaticLayer;

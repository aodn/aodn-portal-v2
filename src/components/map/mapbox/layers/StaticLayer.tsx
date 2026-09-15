import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapContext from "../MapContext";
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { TestHelper } from "../../../common/test/helper";
import MapboxWorldLayer, { MapboxWorldLayersDef } from "./MapboxWorldLayer";
import { cssFontFamilyToMapboxTextFont } from "@/utils/MapUtils";
import { useTheme } from "@mui/material";
import { SymbolLayerSpecification } from "mapbox-gl";
import { addMenuOverlayLayer } from "../layerOrder";
import {
  BoundaryName,
  StaticLayersDef,
  fetchAllenCoralAtlasOptions,
  fetchMarineEcoregionOptions,
  fetchMarineParkOptions,
} from "./staticLayerOptions";
import type {
  BoundaryProperties,
  StaticLayersProps,
} from "./staticLayerOptions";

const STATIC_LAYER_LABEL_PAINT: SymbolLayerSpecification["paint"] = {
  "text-color": "#ffffff",
  "text-halo-color": "#000000",
  "text-halo-width": 2,
};

const STATIC_LAYER_LABEL_LAYOUT: SymbolLayerSpecification["layout"] = {
  "text-offset": [0, 1.25],
  "text-anchor": "center",
  "text-allow-overlap": false,
  "text-ignore-placement": false,
  "symbol-placement": "point",
};

// Use to create a static layer on a map, you need to add a menu item to select those layers,
// refer to a map section
const createStaticLayers = (ids: Array<string>) => (
  <>
    {ids.map((id) => {
      switch (id) {
        case StaticLayersDef.ALLEN_CORAL_ATLAS.id: {
          return (
            <MapBoundaryLayer
              key={"s" + id}
              {...StaticLayersDef.ALLEN_CORAL_ATLAS}
            />
          );
        }
        case StaticLayersDef.AUSTRALIA_MARINE_PARKS.id: {
          return (
            <MapBoundaryLayer
              key={"s" + id}
              {...StaticLayersDef.AUSTRALIA_MARINE_PARKS}
            />
          );
        }
        case StaticLayersDef.MEOW.id: {
          return <MapBoundaryLayer key={"s" + id} {...StaticLayersDef.MEOW} />;
        }
        case MapboxWorldLayersDef.WORLD.id:
          return (
            <MapboxWorldLayer key={"mb" + MapboxWorldLayersDef.WORLD.id} />
          );
      }
    })}
  </>
);

const StaticLayer: FC<Partial<StaticLayersProps>> = ({
  id,
  label,
  features,
}) => {
  const { map } = useContext(MapContext);
  const theme = useTheme();
  const isCreatedRef = useRef<boolean>(false);

  const [sourceId, layerId, layerLabelId] = useMemo(() => {
    const sourceId = `static-geojson-${map?.getContainer().id}-source-${id}`;
    const layerId = `static-geojson-${map?.getContainer().id}-layer-${id}`;
    const layerLabelId = `static-geojson-${map?.getContainer().id}-label-${id}`;
    return [sourceId, layerId, layerLabelId];
  }, [id, map]);

  const createLayer = useCallback(() => {
    if (!features || map?.getSource(sourceId)) return;

    map?.addSource(sourceId, {
      type: "geojson",
      // Use a URL for the value for the `data` property.
      data: features,
    });

    if (map) {
      addMenuOverlayLayer(map, {
        id: layerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": stringToColor(id!),
          "fill-outline-color": "black",
        },
      });

      // Add a symbol layer to display the names
      addMenuOverlayLayer(map, {
        id: layerLabelId,
        type: "symbol",
        source: sourceId,
        layout: {
          ...STATIC_LAYER_LABEL_LAYOUT,
          "text-font": cssFontFamilyToMapboxTextFont(
            theme.typography.body2Regular.fontFamily,
            { fontWeight: theme.typography.body2Regular.fontWeight }
          ),
          "text-field": ["get", label],
        },
        paint: STATIC_LAYER_LABEL_PAINT,
      });
    }
    isCreatedRef.current = true;
  }, [map, layerId, sourceId, layerLabelId, features, id, label, theme]);

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

    // Only create once, the strict mode causes twice call, do not put
    // return here as we need to destroy the layer.
    if (!isCreatedRef.current) {
      createLayer();
    }

    return () => {
      // Always remember to clean up resources
      try {
        if (map?.getSource(sourceId)) {
          map?.removeLayer(layerLabelId);
          map?.removeLayer(layerId);
          map?.removeSource(sourceId);
          isCreatedRef.current = false;
        }
      } catch (error) {
        // OK to ignore error here
      }
    };
  }, [map, createLayer, layerId, sourceId, layerLabelId]);

  return id === StaticLayersDef.AUSTRALIA_MARINE_PARKS.id ? (
    <TestHelper
      id={map?.getContainer().id || ""}
      getAUMarineParksLayer={() => layerId}
    />
  ) : id === StaticLayersDef.ALLEN_CORAL_ATLAS.id ? (
    <TestHelper
      id={map?.getContainer().id || ""}
      getAllenCoralAtlasLayer={() => layerId}
    />
  ) : id === StaticLayersDef.MEOW.id ? (
    <TestHelper
      id={map?.getContainer().id || ""}
      getMarineEcoregionLayer={() => layerId}
    />
  ) : (
    <React.Fragment />
  );
};

// A shortcut for Australian marine parks
const MapBoundaryLayer: FC<StaticLayersProps> = (props) => {
  const [data, setData] = useState<
    FeatureCollection<Polygon> | FeatureCollection<MultiPolygon> | undefined
  >(undefined);

  // Data orginated from here, we store a copy in the following path and useEffect to load it so we do not need to bundle it to the package which make is very big
  // https://data.gov.au/dataset/ds-dcceew-https%3A%2F%2Fwww.arcgis.com%2Fhome%2Fitem.html%3Fid%3D2b3eb1d42b8d4319900cf4777f0a83b9%26sublayer%3D0/details?q=marine%20park
  useEffect(() => {
    const fetcher =
      props.id === StaticLayersDef.AUSTRALIA_MARINE_PARKS.id
        ? fetchMarineParkOptions
        : props.id === StaticLayersDef.MEOW.id
          ? fetchMarineEcoregionOptions
          : props.id === StaticLayersDef.ALLEN_CORAL_ATLAS.id
            ? fetchAllenCoralAtlasOptions
            : null;

    if (fetcher) {
      fetcher()
        .then((options: any[]) => {
          const allFeatures = options.map((o) => o.geo.features[0]);
          setData({
            type: "FeatureCollection",
            features: allFeatures,
          });
        })
        .catch((error) => console.error("Error fetching shared JSON:", error));
    }
  }, [props.id]);

  return (
    <StaticLayer
      id={props.id}
      name={props.name}
      label={props.label}
      features={data}
    />
  );
};

// Export need layers
export {
  createStaticLayers,
  STATIC_LAYER_LABEL_PAINT,
  STATIC_LAYER_LABEL_LAYOUT,
};

// Re-exported so existing importers keep working. New code should import these
// straight from ./staticLayerOptions -- that module carries no mapbox-gl
// dependency, which is what keeps them off the landing page's critical path.
export {
  BoundaryName,
  StaticLayersDef,
  fetchMarineParkOptions,
  fetchMarineEcoregionOptions,
  fetchAllenCoralAtlasOptions,
};
export type { BoundaryProperties, StaticLayersProps };

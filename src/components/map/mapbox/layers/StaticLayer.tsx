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
import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import { stringToColor } from "../../../common/colors/colorsUtils";
import { simplify } from "@turf/turf";
import _ from "lodash";
import { TestHelper } from "../../../common/test/helper";
import {
  allenCoralAtlasDefault,
  marineEcoregionOfWorldDefault,
  marineParkDefault,
} from "../../../common/constants";
import MapboxWorldLayer, { MapboxWorldLayersDef } from "./MapboxWorldLayer";
import { cssFontFamilyToMapboxTextFont } from "../../../../utils/MapUtils";
import { useTheme } from "@mui/material";
import { SymbolLayerSpecification } from "mapbox-gl";

export enum BoundaryName {
  AUSTRALIAN_MARINE_PARKS = "AUSTRALIAN_MARINE_PARKS",
  CORAL_ATLAS = "CORAL_ATLAS",
  MEOW = "MEOW",
}

export interface StaticLayersProps {
  id: string;
  name: string;
  boundaryName: BoundaryName;
  label: string;
  geojson: string;
  termsOfUse: string;
  features?: FeatureCollection;
}

/**
 * Properties injected into GeoJSON features for boundary selection.
 * Extends GeoJsonProperties (non-null part) by including metadata for the boundary.
 */
export type BoundaryProperties = {
  boundaryName: BoundaryName;
  label: string;
  value: string;
} & GeoJsonProperties;

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

const StaticLayersDef: Record<string, StaticLayersProps> = {
  AUSTRALIA_MARINE_PARKS: {
    id: "static-australia-marine-parks",
    name: "Australian Marine Parks",
    boundaryName: BoundaryName.AUSTRALIAN_MARINE_PARKS,
    geojson: marineParkDefault.geojson,
    termsOfUse: marineParkDefault.termsOfUse,
    label: "RESNAME",
  },
  ALLEN_CORAL_ATLAS: {
    id: "static-allen-coral-atlas",
    name: "Allen Coral Atlas",
    boundaryName: BoundaryName.CORAL_ATLAS,
    geojson: allenCoralAtlasDefault.geojson,
    termsOfUse: allenCoralAtlasDefault.termsOfUse,
    label: "ECOREGION",
  },
  MEOW: {
    id: "static-meow",
    name: "Marine Ecoregion of the World",
    boundaryName: BoundaryName.MEOW,
    geojson: marineEcoregionOfWorldDefault.geojson,
    termsOfUse: marineEcoregionOfWorldDefault.termsOfUse,
    label: "ECOREGION",
  },
};

// Cache for processed GeoJSON data to prevent redundant fetches
const dataCache: Record<string, any> = {};

const loadAndProcessGeoJSON = async (
  url: string,
  boundaryName: BoundaryName,
  groupKey: string,
  labelKey: string,
  idKey: string,
  shouldSimplify = false
) => {
  const cacheKey = `${url}_${shouldSimplify}`;
  if (dataCache[cacheKey]) return dataCache[cacheKey];

  const response = await fetch(url);
  const json: FeatureCollection<Polygon | MultiPolygon> = await response.json();

  const grouped = _.groupBy(
    json.features,
    (feature) => feature.properties?.[groupKey]
  );

  const options = Object.values(grouped)
    .map((features) => {
      const firstFeature = features[0] as Feature<Polygon | MultiPolygon>;
      const geometry = shouldSimplify
        ? (simplify(firstFeature, {
            tolerance: 0.05,
            highQuality: false,
          }) as Feature<Polygon | MultiPolygon>)
        : firstFeature;

      const label = firstFeature.properties?.[labelKey];
      const value = "" + firstFeature.properties?.[idKey];

      const enhancedFeature: Feature<
        Polygon | MultiPolygon,
        BoundaryProperties
      > = {
        ...geometry,
        properties: {
          ...geometry.properties,
          boundaryName,
          label,
          value,
        },
      };

      const collection: FeatureCollection<
        Polygon | MultiPolygon,
        BoundaryProperties
      > = {
        type: "FeatureCollection",
        features: [enhancedFeature],
      };

      return {
        boundaryName,
        label,
        value,
        geo: collection,
      };
    })
    .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));

  dataCache[cacheKey] = options;
  return options;
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

    map?.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": stringToColor(id!),
        "fill-outline-color": "black",
      },
    });

    // Add a symbol layer to display the names
    map?.addLayer({
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

const fetchMarineParkOptions = (shouldSimplify = false) =>
  loadAndProcessGeoJSON(
    StaticLayersDef.AUSTRALIA_MARINE_PARKS.geojson,
    StaticLayersDef.AUSTRALIA_MARINE_PARKS.boundaryName,
    "RESNAME",
    "RESNAME",
    "OBJECTID",
    shouldSimplify
  );

const fetchMarineEcoregionOptions = (shouldSimplify = false) =>
  loadAndProcessGeoJSON(
    StaticLayersDef.MEOW.geojson,
    StaticLayersDef.MEOW.boundaryName,
    "ECOREGION",
    "ECOREGION",
    "ECO_CODE",
    shouldSimplify
  );

const fetchAllenCoralAtlasOptions = (shouldSimplify = false) =>
  loadAndProcessGeoJSON(
    StaticLayersDef.ALLEN_CORAL_ATLAS.geojson,
    StaticLayersDef.ALLEN_CORAL_ATLAS.boundaryName,
    "ECOREGION",
    "ECOREGION",
    "OBJECTID",
    shouldSimplify
  );

// Export need layers
export {
  StaticLayersDef,
  createStaticLayers,
  fetchMarineParkOptions,
  fetchMarineEcoregionOptions,
  fetchAllenCoralAtlasOptions,
  STATIC_LAYER_LABEL_PAINT,
  STATIC_LAYER_LABEL_LAYOUT,
};

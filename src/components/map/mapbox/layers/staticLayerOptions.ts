/**
 * Boundary definitions and their GeoJSON loaders, kept free of any mapbox-gl
 * import on purpose.
 *
 * `ActiveFiltersChips` renders unconditionally on the landing page and needs
 * these three fetchers. While they lived in `StaticLayer.tsx` they dragged
 * mapbox-gl and @mapbox/mapbox-gl-draw into the landing page's chunk through
 * StaticLayer -> MapUtils -> MapboxDraw, which defeated route-level code
 * splitting. Same leaf-module pattern used to break the import cycles in
 * src/app/TECH_DEBT.md.
 *
 * NOTE: `src/setupTests.ts` mocks the three fetchers globally and must point at
 * this module, not at StaticLayer, or the mock stops intercepting.
 */
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from "geojson";
import { simplify } from "@turf/simplify";
import groupBy from "lodash/groupBy";
import {
  allenCoralAtlasDefault,
  marineEcoregionOfWorldDefault,
  marineParkDefault,
} from "../../../common/constants";

export enum BoundaryName {
  AUSTRALIAN_MARINE_PARKS = "AMP",
  CORAL_ATLAS = "ACA",
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

const dataCache: Record<string, any> = {};

const loadAndProcessGeoJSON = async (
  url: string,
  boundaryName: BoundaryName,
  groupKey: string,
  labelKey: string,
  idKey: string,
  shouldSimplify = false
): Promise<Array<BoundaryProperties>> => {
  const cacheKey = `${url}_${shouldSimplify}`;
  if (dataCache[cacheKey]) return dataCache[cacheKey];

  const response = await fetch(url);
  const json: FeatureCollection<Polygon | MultiPolygon> = await response.json();

  const grouped = groupBy(
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
      const collection: FeatureCollection<
        Polygon | MultiPolygon,
        GeoJsonProperties
      > = {
        type: "FeatureCollection",
        features: [geometry],
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

export {
  StaticLayersDef,
  fetchMarineParkOptions,
  fetchMarineEcoregionOptions,
  fetchAllenCoralAtlasOptions,
};

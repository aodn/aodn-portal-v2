import {
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
} from "geojson";
import { LngLatLike, Map as MapboxMap, Popup } from "mapbox-gl";
import type { Theme } from "@mui/material/styles";

// Spatial extent descriptions on the detail map.
//
// Each extent of a GeoNetwork record can carry a description
// (gex:EX_Extent/gex:description). es-indexer writes the extents to STAC
// summaries.proj:geometry, one member per extent with that description under
// {"metadata": {"description": ...}}. ogcapi-java returns the field as
// properties.geometry, which the portal reads through OGCCollection.getGeometry().

export interface GeometryMetadata {
  description?: string;
}

export interface PopupTextStyle {
  fontFamily: string;
  fontSize: string;
  color: string;
}

type DescribedGeometry = Geometry & { metadata?: GeometryMetadata };

// Open the popup at the clicked spot. The caller keeps the returned Popup to
// close it later.
export const openExtentPopup = (
  map: MapboxMap,
  lngLat: LngLatLike,
  descriptions: Array<string>,
  style: PopupTextStyle
): Popup => {
  const popup = new Popup({ closeButton: false, offset: [0, -4] })
    .setLngLat(lngLat)
    .setDOMContent(renderDescriptionList(descriptions, style))
    .addTo(map);
  // Mapbox's default padding is uneven (10 10 15), even it out so the text sits centred
  const box = popup
    .getElement()
    ?.querySelector<HTMLElement>(".mapboxgl-popup-content");
  if (box) box.style.padding = "8px 12px";
  return popup;
};

// One line per description, as plain text so metadata cannot inject markup.
// Long lists scroll instead of covering the map.
export const renderDescriptionList = (
  descriptions: Array<string>,
  style: PopupTextStyle
): HTMLDivElement => {
  const content = document.createElement("div");
  content.style.fontFamily = style.fontFamily;
  content.style.fontSize = style.fontSize;
  content.style.color = style.color;
  content.style.textAlign = descriptions.length > 1 ? "left" : "center";
  content.style.maxHeight = "150px";
  content.style.overflowY = "auto";
  descriptions.forEach((description) => {
    const line = document.createElement("div");
    line.textContent = description;
    content.appendChild(line);
  });
  return content;
};

// The popup text uses the theme's small body text
export const getPopupTextStyle = (theme: Theme): PopupTextStyle => ({
  fontFamily: String(theme.typography.body3Small?.fontFamily ?? ""),
  fontSize: String(theme.typography.body3Small?.fontSize ?? ""),
  color: theme.palette.text2,
});

// The distinct descriptions of the features under a click. Several sites can
// share one spot, each keeps its own line.
export const getFeatureDescriptions = (
  features: Array<Feature> | undefined
): Array<string> => {
  const descriptions = (features ?? [])
    .map((feature) => parseMetadata(feature.properties?.metadata)?.description)
    .filter(
      (description): description is string =>
        typeof description === "string" && description !== ""
    );
  return [...new Set(descriptions)];
};

// True when the feature has a description to show, used for the pointer cursor
export const hasDescription = (feature: Feature | undefined): boolean =>
  getFeatureDescriptions(feature ? [feature] : undefined).length > 0;

// Mapbox returns nested properties as JSON strings on events, accept both forms
const parseMetadata = (value: unknown): GeometryMetadata | undefined => {
  if (value && typeof value === "object") return value as GeometryMetadata;
  if (typeof value !== "string") return undefined;
  try {
    return JSON.parse(value) as GeometryMetadata;
  } catch {
    return undefined;
  }
};

// Turn the geometry members into map features. Mapbox drops unknown members of a
// geometry, so the metadata moves into the feature properties.
export const toFeatureCollection = (
  geometry: GeometryCollection | undefined
): FeatureCollection | undefined => {
  if (!geometry?.geometries?.length) return undefined;
  const features: Array<Feature> = geometry.geometries.map((member) => {
    const { metadata, ...shape } = member as DescribedGeometry;
    return {
      type: "Feature",
      geometry: shape as Geometry,
      properties: metadata ? { metadata } : {},
    };
  });
  return { type: "FeatureCollection", features };
};

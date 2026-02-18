export type MapTileRequest = {
  layerName: string;
  width?: number;
  height?: number;
  datetime?: string;
  bbox?: string;
};

export type MapFeatureRequest = {
  uuid: string;
  layerName?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  bbox?: string;
  enableGeoServerWhiteList?: boolean;
};

type FieldsInfo = {
  label: string;
  name: string;
  type: string;
};

type NcWmsLayerInfo = {
  units: string;
  bbox: Array<number>;
  palettes: Array<string>;
  defaultPalette: string;
  scaleRange: Array<number>;
  datesWithData: { [year: string]: { [month: string]: number[] } };
  numColorBands: number;
  supportedStyles: Array<string>;
  moreInfo: string;
  timeAxisUnits: string;
  nearestTimeIso: string;
  logScaling: boolean;
};

// Response type for wfs_fields and wms_fields endpoints
export type GeoserverFieldsResponse = {
  typename: string;
  fields: FieldsInfo[];
};

// Response type for wms_layers endpoint
export type MapLayerResponse = {
  name: string;
  title: string;
  queryable: string;
  ncWmsLayerInfo?: NcWmsLayerInfo;
};

// Response type for wfs_layers endpoint
export type DownloadLayersResponse = {
  name: string;
  title: string;
};

// Response type for wms_feature_info endpoint
export type MapFeatureResponse = {
  latitude: number;
  longitude: number;
  iIndex: number;
  jIndex: number;
  gridCentreLon: number;
  gridCentreLat: number;
  html?: string;
  featureInfo?: Array<{
    time?: Date;
    value?: number;
  }>;
};

export enum FieldType {
  Geom = "GeometryPropertyType",
  DateTime = "dateTime",
  Date = "date",
}

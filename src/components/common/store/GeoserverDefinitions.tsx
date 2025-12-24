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

export type MapFieldResponse = {
  label: string;
  type: string;
  name: string;
};

export type MapLayerResponse = {
  name: string;
  title: string;
  queryable: string;
  ncWmsLayerInfo?: {
    units: string;
    bbox: Array<number>;
    palettes: Array<string>;
    defaultPalette: string;
    scaleRange: Array<string>;
    datesWithData: { [year: string]: { [month: string]: number[] } };
    numColorBands: number;
    supportedStyles: Array<string>;
    moreInfo: string;
    timeAxisUnits: string;
    nearestTimeIso: string;
    logScale: boolean;
  };
};

export type MapTileRequest = {
  layerName: string;
  width?: number;
  height?: number;
  datetime?: string;
  bbox?: string;
};

export type MapFeatureRequest = {
  uuid: string;
  layerName: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  bbox?: string;
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

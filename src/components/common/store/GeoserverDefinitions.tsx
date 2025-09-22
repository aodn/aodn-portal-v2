export type MapFeatureRequest = {
  uuid: string;
  layerName: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  i?: number;
  j?: number;
  bbox?: string;
};

export type MapFeatureResponse = {
  latitude: number;
  longitude: number;
  iIndex: number;
  jIndex: number;
  gridCentreLon: number;
  gridCentreLat: number;
  featureInfo?: Array<{
    time?: Date;
    value?: number;
    platformNumber?: string;
    dataCentre?: string;
    profileProcessingMode?: string;
    oxygenSensorOnFloat?: boolean;
  }>;
};

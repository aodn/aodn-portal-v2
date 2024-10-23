export class Dataset {
  private uuid?: string;
  private data?: IDataRecord[];

  getData = () => {
    return this.data;
  };

  constructor(featureGeoJson: IFeatureGeoJson) {
    this.uuid = featureGeoJson.id.id;
    this.data = [];
    featureGeoJson.geometry.geometries.forEach((geometry) => {
      this.data?.push({
        lat: geometry.coordinates[1],
        lon: geometry.coordinates[0],
        depth: geometry.coordinates[2],
        time: new Date(geometry.properties.time),
      });
    });
  }
}

export interface IDataRecord {
  lat: number;
  lon: number;
  depth?: number;
  time: Date;
}

export interface IFeatureGeoJson {
  id: IFeatureJsonId;
  geometry: IGeometrycollectionGeoJson;
}

export interface IFeatureJsonId {
  id: string;
  type: string;
}

export interface IGeometrycollectionGeoJson {
  geometries: IPointGeoJson[];
  type: string;
}

export interface IPointGeoJson {
  coordinates: number[];
  properties: IPointProperties;
  type: string;
}

export interface IPointProperties {
  time: Date;
}

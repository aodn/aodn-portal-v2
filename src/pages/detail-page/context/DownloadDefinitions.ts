import { BBox, MultiPolygon } from "geojson";

export enum DownloadConditionType {
  BBOX = "bbox",
  POLYGON = "polygon",
  DATE_RANGE = "date_range",
  FORMAT = "format",
  KEY = "key",
}
export enum SubsettingType {
  TimeSlider = "TimeSlider",
  DrawRect = "DrawRect",
}

/**
 * Live evaluation context for condition.support().
 * Prefer calling isSubsettingSupported so layer/capabilities stay current.
 */
export type ConditionSupportContext = {
  isSubsettingSupported: (type: SubsettingType) => boolean;
};

export type ConditionSupportFn = (ctx: ConditionSupportContext) => boolean;

const alwaysSupported: ConditionSupportFn = () => true;

const timeSliderSupported: ConditionSupportFn = ({ isSubsettingSupported }) =>
  isSubsettingSupported(SubsettingType.TimeSlider);

const drawRectSupported: ConditionSupportFn = ({ isSubsettingSupported }) =>
  isSubsettingSupported(SubsettingType.DrawRect);

export interface IDownloadCondition {
  type: DownloadConditionType;
  id: string;
  /**
   * Whether this condition type is supported for the current map layer /
   * capabilities. Evaluated at render time — do not cache the result.
   */
  support: ConditionSupportFn;
}

export interface IDownloadConditionCallback {
  removeCallback?: () => void;
}

// TODO: will support multi polygons later. currently only for 1 bbox
export interface DatasetDownloadRequest {
  inputs: {
    uuid: string;
    key: string;
    recipient: string;
    start_date: string;
    end_date: string;
    multi_polygon: MultiPolygon | string;
    output_format: string;
    data_usage?: {
      purposes: string[];
      sectors: string[];
      allow_contact: boolean | null;
    };
    collection_title?: string;
    full_metadata_link?: string;
    suggested_citation?: string;
  };
  outputs: object;
  subscriber: {
    successUri: string;
    inProgressUri: string;
    failedUri: string;
  };
}

export class DateRangeCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType = DownloadConditionType.DATE_RANGE;
  id: string;
  start: string;
  end: string;
  support: ConditionSupportFn = timeSliderSupported;
  removeCallback?: () => void;

  constructor(
    id: string,
    start: string,
    end: string,
    removeCallback?: () => void
  ) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.removeCallback = removeCallback;
  }
}

export class BBoxCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType;
  bbox: BBox;
  id: string;
  support: ConditionSupportFn = drawRectSupported;
  removeCallback?: () => void;

  constructor(id: string, bbox: BBox, removeCallback?: () => void) {
    this.type = DownloadConditionType.BBOX;
    this.id = id;
    this.bbox = bbox;
    this.removeCallback = removeCallback;
  }
}

export class PolygonCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType = DownloadConditionType.POLYGON;
  coordinates: [number, number][];
  id: string;
  support: ConditionSupportFn = drawRectSupported;
  removeCallback?: () => void;

  constructor(
    id: string,
    coordinates: [number, number][],
    removeCallback?: () => void
  ) {
    this.id = id;
    this.coordinates = coordinates;
    this.removeCallback = removeCallback;
  }
}

export class FormatCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType = DownloadConditionType.FORMAT;
  id: string;
  format: string;
  support: ConditionSupportFn = alwaysSupported;
  removeCallback?: () => void;

  constructor(id: string, format: string, removeCallback?: () => void) {
    this.id = id;
    this.format = format;
    this.removeCallback = removeCallback;
  }
}

export class KeyCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type = DownloadConditionType.KEY;
  id: string;
  key: string;
  support: ConditionSupportFn = alwaysSupported;
  removeCallback?: () => void;

  constructor(id: string, key: string, removeCallback?: () => void) {
    this.id = id;
    this.key = key;
    this.removeCallback = removeCallback;
  }
}

export type WFSDownloadRequest = {
  uuid: string;
  layerName: string;
  downloadConditions: IDownloadCondition[];
};

export type CoEstimateRequest = {
  uuid: string;
  downloadConditions: IDownloadCondition[];
};

export type DownloadCondition = {
  downloadConditions: IDownloadCondition[];
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  removeDownloadCondition: (condition: IDownloadCondition) => void;
};

export enum DownloadServiceType {
  WFS = "WFS",
  CloudOptimised = "CloudOptimised",
  Unavailable = "Unavailable",
}

/** Live map-layer subsetting capabilities published by MapPanel. */
export type MapSubsettingCapabilities = {
  selectedLayerId: string | null;
  /** null = PMTiles metadata not loaded yet; false = timeless tiles */
  pmtilesHasTime: boolean | null;
  geoServerHasTime: boolean;
  geoServerDrawRect: boolean;
  isSupportPMTiles: boolean;
  downloadServiceAvailable: boolean;
  /** A `rel=summary` link, i.e. zarr / parquet data behind the record. */
  hasCloudOptimisedData: boolean;
};

export const defaultMapSubsettingCapabilities: MapSubsettingCapabilities = {
  selectedLayerId: null,
  pmtilesHasTime: null,
  geoServerHasTime: false,
  geoServerDrawRect: false,
  isSupportPMTiles: false,
  downloadServiceAvailable: false,
  hasCloudOptimisedData: false,
};

/**
 * Single source of truth for map menu + download subsetting UI visibility.
 * Layer-aware: GeoServer time does not imply PMTiles time (and vice versa).
 */
export const evaluateSubsettingSupport = (
  type: SubsettingType,
  caps: MapSubsettingCapabilities,
  layerNames: { PMTiles: string; GeoServer: string }
): boolean => {
  const isPMTilesSelected =
    caps.isSupportPMTiles && caps.selectedLayerId === layerNames.PMTiles;
  const isGeoServerSelected = caps.selectedLayerId === layerNames.GeoServer;

  switch (type) {
    case SubsettingType.TimeSlider:
      // PMTiles density is filtered by date range from `.metadata` coverage.
      // Timeless tiles (`has_time: false`) have no real temporal dimension.
      if (isPMTilesSelected && caps.pmtilesHasTime === false) return false;
      // Cloud optimised data (zarr / parquet) always supports datetime
      // subsetting for download, independent of which layer the map renders
      return (
        caps.hasCloudOptimisedData ||
        isPMTilesSelected ||
        (isGeoServerSelected && caps.geoServerHasTime)
      );
    case SubsettingType.DrawRect:
      // Same as above - cloud optimised downloads always accept a spatial
      // filter. Checked before `downloadServiceAvailable`, which starts out
      // false until DownloadCard's effect resolves the real service.
      if (caps.hasCloudOptimisedData) return true;
      if (!caps.downloadServiceAvailable) return false;
      return (
        isPMTilesSelected || (isGeoServerSelected && caps.geoServerDrawRect)
      );
    default:
      return false;
  }
};

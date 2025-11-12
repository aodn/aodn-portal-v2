import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  Point,
  Position,
} from "geojson";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { bboxPolygon } from "@turf/turf";

import * as turf from "@turf/turf";
import wmsIcon from "../../../assets/icons/wms-icon.png";
import wfsIcon from "../../../assets/icons/wfs-icon.png";
import linkIcon from "../../../assets/icons/link.png";
import dayjs from "dayjs";
import { dateDefault } from "../constants";

// interfaces:
export interface IKeyword {
  title: string;
  content: string[];
}

export interface ILink {
  rel: string;
  href: string;
  type: string;
  title: string;
  "ai:group"?: string;
  description?: string;
  getIcon?: () => string;
}

export interface IAddress {
  delivery_point: string[];
  city: string;
  administrative_area: string;
  postal_code: string;
  country: string;
}

export interface IInfo {
  value: string;
  roles: string[];
}

export interface ITemporal {
  start?: string;
  end?: string;
}

export interface ICitation {
  suggestedCitation?: string;
  otherConstraints?: string[];
  useLimitations?: string[];
}

export interface IContact {
  name: string;
  organization: string;
  identifier: string;
  position: string;
  emails: string[];
  addresses: IAddress[];
  phones: IInfo[];
  links: ILink[];
  roles: string[];
}

export interface IConcept {
  id: string;
  url: string;
  description: string;
  title: string;
}

export interface ITheme {
  scheme: string;
  concepts: IConcept[];
  description: string;
  title: string;
}

export interface IAssociatedRecordGroup {
  parent?: IAssociatedRecord;
  children: IAssociatedRecord[];
  siblings: IAssociatedRecord[];
}

export interface IAssociatedRecord {
  uuid: string;
  title: string;
  abstract: string;
}

// Enums
export enum RelationType {
  SELF = "self",
  LICENSE = "license",
  PARENT = "parent",
  SIBLING = "sibling",
  CHILD = "child",
  RELATED = "related",
  DESCRIBEDBY = "describedby",
  ICON = "icon",
  PREVIEW = "preview",
  WMS = "wms",
  WFS = "wfs",
}

export enum MediaType {
  TEXT_HTML = "text/html",
  IMAGE_PNG = "image/png",
  PYTHON_NOTEBOOK = "application/x-ipynb+json",
  PARQUET = "application/x-parquet",
  ZARR = "application/x-zarr",
}

export enum AIGroup {
  DATA_ACCESS = "Data Access",
  DOCUMENT = "Document",
  PYTHON_NOTEBOOK = "Python Notebook",
  OTHER = "Other",
}

export enum DataAccessSubGroup {
  WFS = "wfs",
  WMS = "wms",
  AWS = "aws",
  THREDDS = "thredds",
}

export enum DatasetType {
  PARQUET = "parquet",
  ZARR = "zarr",
}

// Helper function to extract subgroup type from ai:group
export const getSubgroup = (link: ILink): DataAccessSubGroup | undefined => {
  const aiGroup = link["ai:group"];
  if (!aiGroup || !aiGroup.includes(" > ")) {
    return undefined;
  }
  return aiGroup.split(" > ")[1]?.trim() as DataAccessSubGroup;
};

const getIcon = (link: ILink) => {
  const subgroupType = getSubgroup(link);

  if (subgroupType) {
    switch (subgroupType.toLowerCase()) {
      case DataAccessSubGroup.WMS:
        return wmsIcon;
      case DataAccessSubGroup.WFS:
        return wfsIcon;
      default:
        return linkIcon;
    }
  } else {
    return linkIcon;
  }
};

// Please put all OGCCollection interfaces, types, or classes here.
export class OGCCollection {
  private propValue?: SummariesProperties;
  private propExtent?: Spatial;
  private propLinks?: Array<ILink>;
  // Get links by AI group
  private getLinksByAIGroup = (group: string): ILink[] | undefined => {
    const result = this.links?.filter((link) => link["ai:group"] === group);
    return result?.length ? result : undefined;
  };
  // Get links by AI group prefix
  private getLinksByAIGroupPrefix = (
    groupPrefix: string
  ): ILink[] | undefined => {
    const result = this.links?.filter((link) =>
      link["ai:group"]?.startsWith(groupPrefix)
    );
    return result?.length ? result : undefined;
  };
  // Get links by AI subgroup
  private getLinksByAISubgroup = (subgroup: string): ILink[] | undefined => {
    const result = this.links?.filter(
      (link) => getSubgroup(link)?.toLowerCase() === subgroup.toLowerCase()
    );
    return result?.length ? result : undefined;
  };

  readonly id: string = "undefined";
  readonly title?: string;
  readonly description?: string;
  readonly itemType?: string;

  set extent(extents: any) {
    this.propExtent = new Spatial(this);
    this.propExtent.bbox = extents.spatial ? extents.spatial.bbox : undefined;
    this.propExtent.crs = extents.spatial ? extents.spatial.crs : undefined;
    this.propExtent.temporal = extents.temporal;
  }

  get links(): ILink[] | undefined {
    return this.propLinks;
  }

  set links(links: ILink[] | undefined) {
    this.propLinks = links?.map<ILink>((link) => {
      return { ...link, getIcon: () => getIcon(link) };
    });
  }

  get extent(): Spatial | undefined {
    return this.propExtent;
  }

  set extentInt(ext: Spatial | undefined) {
    this.propExtent = ext;
  }

  get properties(): SummariesProperties | undefined {
    return this.propValue;
  }

  set properties(props: SummariesProperties | undefined) {
    this.propValue = Object.assign(new SummariesProperties(), props);
  }

  // Locate the thumbnail from the links array
  findThumbnail = (): string => {
    const target = this.links?.find(
      (l) => l.type === "image" && l.rel === RelationType.PREVIEW
    );
    return target !== undefined && target.href.length > 0
      ? target.href
      : default_thumbnail;
  };
  // Locate the logo from the links array
  findIcon = (): string | undefined => {
    const target = this.links?.find(
      (l) => l.type === "image/png" && l.rel === RelationType.ICON
    );
    return target !== undefined ? target.href : undefined;
  };

  // get properties
  getPace = (): string | undefined => this.propValue?.pace;
  getStatus = (): string | undefined => this.propValue?.status;
  getCredits = (): string[] | undefined => this.propValue?.credits;
  getContacts = (): IContact[] | undefined => this.propValue?.contacts;
  getThemes = (): ITheme[] | undefined => this.propValue?.themes;
  getBBox = (): Position[] | undefined => this.propExtent?.bbox;
  // It is a well form geometry collection of detail spatial extents
  getGeometry = (): GeometryCollection | undefined => this.propValue?.geometry;
  getCentroid = (): Array<Feature<Point>> | undefined =>
    this.propValue?.centroid?.map((i) => turf.point(i));
  getExtent = () => this.propExtent;
  getCitation = (): ICitation | undefined => this.propValue?.citation;
  getStatement = (): string | undefined => this.propValue?.statement;
  getLicense = (): string | undefined => this.propValue?.license;
  getCreation = (): string | undefined => this.propValue?.creation;
  getRevision = (): string | undefined => this.propValue?.revision;
  getMetadataUrl = (): string | undefined =>
    this.links?.filter(
      (link) =>
        link.type === "text/html" && link.rel === RelationType.DESCRIBEDBY
    )?.[0]?.href;
  // Get the AI enhanced description
  getEnhancedDescription = (): string | undefined =>
    this.propValue?.["ai:description"];
  getDataAccessLinks = (): ILink[] | undefined =>
    this.getLinksByAIGroupPrefix(AIGroup.DATA_ACCESS);
  getWMSLinks = (): ILink[] | undefined =>
    this.getLinksByAISubgroup(DataAccessSubGroup.WMS);
  getWFSLinks = (): ILink[] | undefined =>
    this.getLinksByAISubgroup(DataAccessSubGroup.WFS);
  getDocumentLinks = (): ILink[] | undefined =>
    this.getLinksByAIGroup(AIGroup.DOCUMENT);
  getPythonNotebookLinks = (): ILink[] | undefined =>
    this.getLinksByAIGroup(AIGroup.PYTHON_NOTEBOOK);
  getOtherLinks = (): ILink[] | undefined =>
    this.getLinksByAIGroup(AIGroup.OTHER);
  getAllAIGroupedLinks = (): ILink[] | undefined =>
    this.links?.filter((link) => link["ai:group"] !== undefined);
  // A feature call summary is provided if you do cloud optimized data download
  hasSummaryFeature = () => this.links?.some((link) => link.rel === "summary");
  getDatasetType = () => {
    const summaryLinks = this.links?.filter((link) => link.rel === "summary");
    if (!summaryLinks || summaryLinks.length === 0) {
      return undefined;
    }

    const type = summaryLinks[0].type;
    if (type === MediaType.PARQUET) {
      return DatasetType.PARQUET;
    } else if (type === MediaType.ZARR) {
      return DatasetType.ZARR;
    } else {
      console.error(
        `Unsupported dataset type: ${type}. Only PARQUET and ZARR are supported.`
      );
      return undefined;
    }
  };
}

export class SummariesProperties {
  readonly score?: number;
  readonly status?: string;
  readonly credits?: Array<string>;
  readonly contacts?: IContact[];
  readonly themes?: ITheme[];
  readonly geometry?: GeometryCollection;
  readonly temporal?: ITemporal[];
  readonly citation?: ICitation;
  readonly statement?: string;
  readonly license?: string;
  readonly creation?: string;
  readonly revision?: string;
  readonly centroid?: Array<Array<number>>;
  readonly pace?: string;
  readonly "ai:description"?: string;
  readonly dataset_group?: string;
}

export class Spatial {
  private parent: OGCCollection;
  private bounding_box: Array<Position> = [];
  private temporal_value: {
    interval: Array<Array<string | null>>;
    trs?: string;
  } = {
    interval: [[]],
  };
  crs: string = "";

  constructor(ogcCollection: OGCCollection) {
    this.parent = ogcCollection;
  }

  set temporal(value: { interval: Array<Array<string | null>>; trs?: string }) {
    this.temporal_value = value;
  }

  get temporal() {
    return this.temporal_value;
  }

  set bbox(bbox: Array<Position>) {
    this.bounding_box = bbox;
  }

  get bbox() {
    return this.bounding_box;
  }

  getOverallTemporal = () => {
    const period = this.temporal.interval;
    let startDate: string | undefined = undefined;
    let endDate: string | undefined = undefined;
    if (period?.[0][0]) {
      startDate = dayjs(period[0][0]).format(dateDefault.DISPLAY_FORMAT);
    }
    if (period?.[0][1]) {
      endDate = dayjs(period[0][1]).format(dateDefault.DISPLAY_FORMAT);
    }
    return [startDate, endDate];
  };
  /**
   * Create a GeoJSON FeatureCollection from the bounding boxes and points value.
   * @param start - The index to start from, from spec, the first is the overall bounding box
   * @returns - The geojson feature collection
   */
  getGeojsonFromBBox = (start: number): FeatureCollection => {
    const featureCollections: FeatureCollection = {
      type: "FeatureCollection",
      features: new Array<Feature>(),
    };

    // Filter valid bounding boxes and points
    const validBoxesAndPoints = this.bbox?.filter(
      (box) => box.length === 4 || box.length === 2
    );

    if (validBoxesAndPoints && validBoxesAndPoints.length > 1) {
      // Create features from valid boxes and points starting from the given index
      const features = validBoxesAndPoints.slice(start).map((pos) => {
        if (pos.length === 4) {
          // So it can be bbox, line or point
          if (pos[0] !== pos[2] && pos[1] !== pos[3]) {
            // Bbox
            return bboxPolygon([pos[0], pos[1], pos[2], pos[3]]);
          } else if (pos[0] === pos[2] && pos[1] === pos[3]) {
            // Must be point
            return turf.point(pos);
          }
        } else {
          return turf.lineString([
            [pos[0], pos[1]],
            [pos[2], pos[3]],
          ]);
        }
        // Assume it is point it will be two pos
        return turf.point(pos);
      });

      // Add individual bounding boxes and points
      featureCollections.features.push(...features);
    }
    return featureCollections;
  };
}

export class OGCCollections {
  private readonly _total: number;
  private _search_after: Array<string>;
  private _collections: Array<OGCCollection>;
  private readonly _links: Array<ILink>;

  constructor(
    collections: Array<OGCCollection> = new Array<OGCCollection>(),
    links: Array<ILink> = new Array<ILink>(),
    total: number = 0,
    search_after: Array<string> = new Array<string>()
  ) {
    // Make sure a new array is created instead of using the
    // ref from the existing object
    this._collections = new Array<OGCCollection>();
    this._collections.push(...collections);

    this._links = new Array<ILink>();
    this._links.push(...links);

    this._search_after = new Array<string>();
    this._search_after.push(...search_after);

    this._total = total;
  }

  get search_after() {
    return this._search_after;
  }

  set search_after(sf: Array<string>) {
    this._search_after = sf;
  }

  get collections() {
    return this._collections;
  }

  set collections(collections: Array<OGCCollection>) {
    this._collections = collections;
  }

  get links() {
    return this._links;
  }

  get total() {
    return this._total;
  }

  merge(collections: OGCCollections) {
    this.collections = this.collections.concat(collections.collections);
    this.search_after = collections.search_after;
  }

  clone() {
    // Need to create a new array, otherwise we will reuse
    // the array and merge call will wrong
    return new OGCCollections(
      this.collections,
      this.links,
      this.total,
      this.search_after
    );
  }
}

import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  GeometryCollection,
  Position,
} from "geojson";
import default_thumbnail from "@/assets/images/default-thumbnail.png";
import { bboxPolygon } from "@turf/turf";

import * as turf from "@turf/turf";

// Please put all OGCCollection interfaces, types, or classes here.

export class OGCCollection {
  private propValue?: SummariesProperties;
  private propExtent?: Spatial;

  readonly id: string = "undefined";
  readonly title?: string;
  readonly description?: string;
  readonly itemType?: string;
  readonly links?: Array<ILink>;

  set extent(extents: any) {
    this.propExtent = new Spatial(this);
    this.propExtent.bbox = extents.spatial.bbox;
    this.propExtent.crs = extents.spatial.crs;
    this.propExtent.temporal = extents.temporal;
  }

  get extent(): Spatial | undefined {
    return this.propExtent;
  }

  set properties(props: SummariesProperties) {
    this.propValue = Object.assign(new SummariesProperties(), props);
  }

  // Locate the thumbnail from the links array
  findThumbnail = (): string => {
    const target = this.links?.find(
      (l) => l.type === "image" && l.rel === RelationType.PREVIEW
    );
    return target !== undefined ? target.href : default_thumbnail;
  };
  // Locate the logo from the links array
  findIcon = (): string | undefined => {
    const target = this.links?.find(
      (l) => l.type === "image/png" && l.rel === RelationType.ICON
    );
    return target !== undefined ? target.href : undefined;
  };

  // get properties
  getStatus = (): string | undefined => this.propValue?.status;
  getCredits = (): string[] | undefined => this.propValue?.credits;
  getContacts = (): IContact[] | undefined => this.propValue?.contacts;
  getThemes = (): ITheme[] | undefined => this.propValue?.themes;
  // It is a well form geometry collection of detail spatial extents
  getGeometry = (): GeometryCollection | undefined => this.propValue?.geometry;
  getTemporal = (): ITemporal[] | undefined => this.propValue?.temporal;
  getCitation = (): ICitation | undefined => this.propValue?.citation;
  getStatement = (): string | undefined => this.propValue?.statement;
  getLicense = (): string | undefined => this.propValue?.license;
  getCreation = (): string | undefined => this.propValue?.creation;
  getRevision = (): string | undefined => this.propValue?.revision;
  getDistributionLinks = (): ILink[] | undefined =>
    this.links?.filter((link) => link.rel === RelationType.RELATED);
  getMetadataUrl = (): string | undefined =>
    this.links?.filter(
      (link) =>
        link.type === "text/html" && link.rel === RelationType.DESCRIBEDBY
    )?.[0]?.href;
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
}

export class Spatial {
  private parent: OGCCollection;

  bbox: Array<Position> = [];
  temporal: {
    interval: Array<Array<string | null>>;
    trs?: string;
  } = { interval: [[]] };
  crs: string = "";

  constructor(ogcCollection: OGCCollection) {
    this.parent = ogcCollection;
  }
  /**
   * Create a GeoJSON FeatureCollection from the bounding boxes and points
   * @param start - The index to start from, from spec, the first is the overall bounding box
   * @returns - The geojson feature collection
   */
  getGeojsonExtents = (start: number): FeatureCollection => {
    const featureCollections: FeatureCollection = {
      type: "FeatureCollection",
      features: new Array<Feature<Geometry, GeoJsonProperties>>(),
    };

    // Filter valid bounding boxes and points
    const validBoxesAndPoints = this.bbox?.filter(
      (box) => box.length === 4 || box.length === 2
    );

    if (validBoxesAndPoints && validBoxesAndPoints.length > 1) {
      // Create features from valid boxes and points starting from the given index
      const features = validBoxesAndPoints.slice(start).map((pos) => {
        return pos.length === 4
          ? bboxPolygon([pos[0], pos[1], pos[2], pos[3]])
          : turf.point(pos);
      });

      // Add individual bounding boxes and points
      featureCollections.features.push(...features);
    }
    return featureCollections;
  };
}

export class OGCCollections {
  private _total: number;
  private _search_after: Array<string>;
  private _collections: Array<OGCCollection>;
  private _links: Array<ILink>;

  constructor(
    collections: Array<OGCCollection> = new Array<OGCCollection>(),
    links: Array<ILink> = new Array<ILink>(),
    total: number = 0,
    search_after: Array<string> = new Array<string>()
  ) {
    this._collections = collections;
    this._links = links;
    this._total = total;
    this._search_after = search_after;
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
    return new OGCCollections(
      this._collections,
      this._links,
      this._total,
      this._search_after
    );
  }
}

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
}

export interface ITheme {
  scheme: string;
  description: string;
  title: string;
  concepts: IConcept[];
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
}

export enum MediaType {
  TEXT_HTML = "text/html",
  IMAGE_PNG = "image/png",
}

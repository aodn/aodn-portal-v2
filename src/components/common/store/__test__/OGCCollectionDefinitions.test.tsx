import { describe, it, expect, vi } from "vitest";
import {
  getSubgroup,
  OGCCollection,
  RelationType,
} from "../OGCCollectionDefinitions"; // Adjust the import path as needed

// Mock the imported icons and default thumbnail
vi.mock("@/assets/images/default-thumbnail.png", () => ({
  default: "mocked-default-thumbnail.png",
}));
vi.mock("../../../assets/icons/wms.png", () => "mocked-wms-icon.png");
vi.mock("../../../assets/icons/wfs.png", () => "mocked-wfs-icon.png");
vi.mock("../../../assets/icons/link.png", () => "mocked-link-icon.png");

describe("OGCCollection", () => {
  describe("findThumbnail", () => {
    it("should return the href of the thumbnail when a valid preview link with type 'image' exists", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.PREVIEW,
          href: "http://example.com/thumbnail.jpg",
          type: "image",
          title: "Thumbnail",
          getIcon: () => "mocked-link-icon.png",
        },
      ];

      const result = collection.findThumbnail();
      expect(result).toBe("http://example.com/thumbnail.jpg");
    });

    it("should return the default thumbnail when no preview link exists", () => {
      const collection = new OGCCollection();
      collection.links = [];

      const result = collection.findThumbnail();
      expect(result).toBe("mocked-default-thumbnail.png");
    });

    it("should return the default thumbnail when preview link exists but href is empty", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.PREVIEW,
          href: "",
          type: "image",
          title: "Empty Thumbnail",
          getIcon: () => "mocked-link-icon.png",
        },
      ];

      const result = collection.findThumbnail();
      expect(result).toBe("mocked-default-thumbnail.png");
    });

    it("should return the default thumbnail when no link matches type 'image' and rel 'preview'", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.WMS,
          href: "http://example.com/wms",
          type: "application/xml",
          title: "WMS Link",
          "ai:group": "Data Access > wms",
          getIcon: () => "mocked-wms-icon.png",
        },
      ];

      const result = collection.findThumbnail();
      expect(result).toBe("mocked-default-thumbnail.png");
    });
  });

  describe("findIcon", () => {
    it("should return the href of the icon when a valid icon link with type 'image/png' exists", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.ICON,
          href: "http://example.com/icon.png",
          type: "image/png",
          title: "Icon",
          getIcon: () => "mocked-link-icon.png",
        },
      ];

      const result = collection.findIcon();
      expect(result).toBe("http://example.com/icon.png");
    });

    it("should return undefined when no icon link exists", () => {
      const collection = new OGCCollection();
      collection.links = [];

      const result = collection.findIcon();
      expect(result).toBeUndefined();
    });

    it("should return undefined when no link matches type 'image/png' and rel 'icon'", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.WMS,
          href: "http://example.com/wms",
          type: "application/xml",
          title: "WMS Link",
          "ai:group": "Data Access > wms",
          getIcon: () => "mocked-wms-icon.png",
        },
      ];

      const result = collection.findIcon();
      expect(result).toBeUndefined();
    });

    it("should return the href of the first matching icon link when multiple icon links exist", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.ICON,
          href: "http://example.com/icon1.png",
          type: "image/png",
          title: "Icon 1",
          getIcon: () => "mocked-link-icon.png",
        },
        {
          rel: RelationType.ICON,
          href: "http://example.com/icon2.png",
          type: "image/png",
          title: "Icon 2",
          getIcon: () => "mocked-link-icon.png",
        },
      ];

      const result = collection.findIcon();
      expect(result).toBe("http://example.com/icon1.png");
    });

    it("should filter links by AI group correctly", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: "related",
          href: "http://example.com/data",
          type: "text/html",
          title: "Data Link",
          "ai:group": "Data Access",
          "ai:role": ["download"],
          getIcon: () => "mocked-link-icon.png",
        },
        {
          rel: "related",
          href: "http://example.com/doc",
          type: "text/html",
          title: "Document Link",
          "ai:group": "Document",
          getIcon: () => "mocked-link-icon.png",
        },
        {
          rel: "related",
          href: "http://example.com/other",
          type: "text/html",
          title: "Other Link",
          getIcon: () => "mocked-link-icon.png",
        },
      ];

      const dataAccessLinks = collection.getDataAccessLinks();
      const documentLinks = collection.getDocumentLinks();
      const otherLinks = collection.getOtherLinks();
      const downloadLinks = collection.getDownloadLinks();

      expect(dataAccessLinks).toHaveLength(1);
      expect(dataAccessLinks?.[0].title).toBe("Data Link");
      expect(documentLinks).toHaveLength(1);
      expect(documentLinks?.[0].title).toBe("Document Link");
      expect(otherLinks).toBeUndefined();
      expect(downloadLinks).toHaveLength(1);
      expect(downloadLinks?.[0].title).toBe("Data Link");
    });

    it("should return undefined when no links match the AI group", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: "related",
          href: "http://example.com/test",
          type: "text/html",
          title: "Test Link",
          getIcon: () => "mocked-link-icon.png",
        },
      ];

      const dataAccessLinks = collection.getDataAccessLinks();
      expect(dataAccessLinks).toBeUndefined();
    });

    it("should extract subgroup from ai:group with subgroup", () => {
      const link = {
        rel: "related",
        href: "http://example.com/wms",
        type: "text/html",
        title: "WMS Link",
        "ai:group": "Data Access > wms",
        getIcon: () => "mocked-wms-icon.png",
      };

      const result = getSubgroup(link);
      expect(result).toBe("wms");
    });

    it("should return WMS links by subgroup", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: "wms",
          href: "http://example.com/wms",
          type: "",
          title: "WMS Service",
          "ai:group": "Data Access > wms",
          getIcon: () => "mocked-wms-icon.png",
        },
        {
          rel: "wfs",
          href: "http://example.com/wfs",
          type: "",
          title: "WFS Service",
          "ai:group": "Data Access > wfs",
          getIcon: () => "mocked-wfs-icon.png",
        },
      ];

      const wmsLinks = collection.getWMSLinks();
      const wfsLinks = collection.getWFSLinks();

      expect(wmsLinks).toHaveLength(1);
      expect(wmsLinks?.[0].title).toBe("WMS Service");
      expect(wfsLinks).toHaveLength(1);
      expect(wfsLinks?.[0].title).toBe("WFS Service");
    });
  });
  describe("fallback mechanism for links without ai:group", () => {
    it("should infer ai:group for wms link based on rel field", () => {
      const collection = new OGCCollection();
      // Fallback link: no ai:group, only rel=wms
      collection.links = [
        {
          rel: RelationType.WMS,
          href: "https://geoserver.example.com/wms",
          type: "",
          title: "seamap:SeamapAus_VIC_statewide_habitats_2023",
        },
      ];

      const wmsLinks = collection.getWMSLinks();
      expect(wmsLinks).toHaveLength(1);
      expect(wmsLinks?.[0].title).toBe(
        "seamap:SeamapAus_VIC_statewide_habitats_2023"
      );
      // Verify ai:group was inferred correctly
      expect(wmsLinks?.[0]["ai:group"]).toBe("Data Access > wms");
    });

    it("should infer ai:group for wfs link based on rel field", () => {
      const collection = new OGCCollection();
      // Fallback link: no ai:group, only rel=wfs
      collection.links = [
        {
          rel: RelationType.WFS,
          href: "https://geoserver.example.com/wfs",
          type: "",
          title: "SeamapAus_VIC_statewide_habitats_2023",
        },
      ];

      const wfsLinks = collection.getWFSLinks();
      expect(wfsLinks).toHaveLength(1);
      expect(wfsLinks?.[0].title).toBe("SeamapAus_VIC_statewide_habitats_2023");
      // Verify ai:group was inferred correctly
      expect(wfsLinks?.[0]["ai:group"]).toBe("Data Access > wfs");
    });

    it("should include fallback wms/wfs links in getDataAccessLinks", () => {
      const collection = new OGCCollection();
      // Mix of ai:group links and fallback links
      collection.links = [
        {
          rel: RelationType.WMS,
          href: "https://geoserver.example.com/wms",
          type: "",
          title: "WMS Fallback",
        },
        {
          rel: RelationType.WFS,
          href: "https://geoserver.example.com/wfs",
          type: "",
          title: "WFS Fallback",
        },
      ];

      const dataAccessLinks = collection.getDataAccessLinks();
      expect(dataAccessLinks).toHaveLength(2);
    });

    it("should not override existing ai:group with inferred value", () => {
      const collection = new OGCCollection();
      // Link already has ai:group, should not be overridden
      collection.links = [
        {
          rel: RelationType.WMS,
          href: "https://geoserver.example.com/wms",
          type: "",
          title: "WMS With AI Group",
          "ai:group": "Data Access > wms",
        },
      ];

      const wmsLinks = collection.getWMSLinks();
      expect(wmsLinks?.[0]["ai:group"]).toBe("Data Access > wms");
    });

    it("should include fallback wms links in getAllAIGroupedLinks", () => {
      const collection = new OGCCollection();
      collection.links = [
        {
          rel: RelationType.WMS,
          href: "https://geoserver.example.com/wms",
          type: "",
          title: "WMS Fallback",
        },
        {
          rel: RelationType.RELATED,
          href: "https://example.com/related",
          type: "text/html",
          title: "Related Link",
        },
      ];

      const allGroupedLinks = collection.getAllAIGroupedLinks();
      // Only WMS fallback link should be included, not the related link
      expect(allGroupedLinks).toHaveLength(1);
      expect(allGroupedLinks?.[0].title).toBe("WMS Fallback");
    });
  });
});

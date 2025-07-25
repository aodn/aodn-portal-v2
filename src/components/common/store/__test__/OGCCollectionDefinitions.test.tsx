import { describe, it, expect, vi } from "vitest";
import { OGCCollection, RelationType } from "../OGCCollectionDefinitions"; // Adjust the import path as needed

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
          "ai:group": "Data Access",
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
          "ai:group": "Data Access",
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

      expect(dataAccessLinks).toHaveLength(1);
      expect(dataAccessLinks?.[0].title).toBe("Data Link");
      expect(documentLinks).toHaveLength(1);
      expect(documentLinks?.[0].title).toBe("Document Link");
      expect(otherLinks).toBeUndefined();
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
  });
});

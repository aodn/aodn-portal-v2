import { vi } from "vitest";
import { Feature } from "geojson";
import AppTheme from "@/styles/theme";
import {
  toFeatureCollection,
  getFeatureDescriptions,
  getPopupTextStyle,
  hasDescription,
  openExtentPopup,
  renderDescriptionList,
} from "../ExtentPopupUtils";

// A Popup that records what it was given, the real one needs a WebGL map
const popupCalls: Array<Record<string, unknown>> = [];
vi.mock("mapbox-gl", () => ({
  Popup: class {
    private element = document.createElement("div");
    constructor(options: unknown) {
      popupCalls.push({ options });
      const content = document.createElement("div");
      content.className = "mapboxgl-popup-content";
      this.element.appendChild(content);
    }
    setLngLat(lngLat: unknown) {
      popupCalls.push({ lngLat });
      return this;
    }
    setDOMContent(content: HTMLElement) {
      popupCalls.push({ content });
      return this;
    }
    addTo(map: unknown) {
      popupCalls.push({ map });
      return this;
    }
    getElement() {
      return this.element;
    }
  },
}));

const point = (metadata: unknown): Feature => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [146.5, -18.5] },
  properties: { metadata },
});

const style = { fontFamily: "Arial", fontSize: "12px", color: "#333" };

describe("openExtentPopup", () => {
  it("should open one popup at the click with every description, padding evened out", () => {
    popupCalls.length = 0;
    const map = { id: "map" } as never;
    const popup = openExtentPopup(
      map,
      [146.5, -18.5],
      ["Masig", "Dungeness"],
      style
    );

    expect(popupCalls[0]).toEqual({
      options: { closeButton: false, offset: [0, -4] },
    });
    expect(popupCalls[1]).toEqual({ lngLat: [146.5, -18.5] });
    const content = popupCalls[2]?.content as HTMLElement;
    expect(
      Array.from(content.children).map((line) => line.textContent)
    ).toEqual(["Masig", "Dungeness"]);
    expect(content.style.fontFamily).toBe("Arial");
    expect(content.style.fontSize).toBe("12px");
    expect(content.style.color).toBe("rgb(51, 51, 51)");
    expect(popupCalls[3]).toEqual({ map });
    const box = popup
      .getElement()
      ?.querySelector<HTMLElement>(".mapboxgl-popup-content");
    expect(box?.style.padding).toBe("8px 12px");
  });
});

describe("renderDescriptionList", () => {
  it("should render one plain-text line per description", () => {
    const element = renderDescriptionList(["Site A", "<b>Site B</b>"], style);
    const lines = Array.from(element.children).map((line) => line.textContent);
    expect(lines).toEqual(["Site A", "<b>Site B</b>"]);
    expect(element.querySelector("b")).toBeNull();
  });

  it("should centre a single line and left-align a list that scrolls", () => {
    expect(renderDescriptionList(["Only"], style).style.textAlign).toBe(
      "center"
    );
    const list = renderDescriptionList(["A", "B"], style);
    expect(list.style.textAlign).toBe("left");
    expect(list.style.maxHeight).toBe("150px");
    expect(list.style.overflowY).toBe("auto");
  });

  it("should apply every text style value", () => {
    const element = renderDescriptionList(["Only"], style);
    expect(element.style.fontFamily).toBe("Arial");
    expect(element.style.fontSize).toBe("12px");
    expect(element.style.color).toBe("rgb(51, 51, 51)");
  });
});

describe("getPopupTextStyle", () => {
  it("should take the small body text of the portal theme", () => {
    expect(getPopupTextStyle(AppTheme)).toEqual({
      fontFamily: AppTheme.typography.body3Small.fontFamily,
      fontSize: "13px",
      color: "#3C3C3C",
    });
    expect(String(AppTheme.typography.body3Small.fontFamily)).toContain(
      "Open Sans"
    );
  });

  it("should fall back to empty strings when the variant is missing", () => {
    const bare = { typography: {}, palette: { text2: "#000000" } } as never;
    expect(getPopupTextStyle(bare)).toEqual({
      fontFamily: "",
      fontSize: "",
      color: "#000000",
    });
  });
});

describe("getFeatureDescriptions", () => {
  it("should read metadata whether mapbox returns it as an object or a JSON string", () => {
    expect(
      getFeatureDescriptions([
        point({ description: "Site A - Temperature" }),
        point(JSON.stringify({ description: "Site B - Currents" })),
      ])
    ).toEqual(["Site A - Temperature", "Site B - Currents"]);
  });

  it("should list every site sharing one spot once", () => {
    expect(
      getFeatureDescriptions([
        point({ description: "Masig" }),
        point({ description: "Masig" }),
        point({ description: "Dungeness" }),
      ])
    ).toEqual(["Masig", "Dungeness"]);
  });

  it("should skip features without a usable description", () => {
    expect(
      getFeatureDescriptions([
        point(undefined),
        point({}),
        point({ description: "" }),
        point("not json"),
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: null,
        },
      ])
    ).toEqual([]);
    expect(getFeatureDescriptions(undefined)).toEqual([]);
  });
});

describe("hasDescription", () => {
  it("should be true only for a feature with a description", () => {
    expect(hasDescription(point({ description: "Masig" }))).toBe(true);
    expect(hasDescription(point({}))).toBe(false);
    expect(hasDescription(undefined)).toBe(false);
  });
});

describe("toFeatureCollection", () => {
  it("should move each member's metadata into feature properties", () => {
    const geometry = {
      type: "GeometryCollection",
      geometries: [
        {
          type: "Point",
          coordinates: [146.5, -18.5],
          metadata: { description: "Pelorus Reef" },
        },
        { type: "Point", coordinates: [150.0, -20.0] },
        {
          type: "Polygon",
          coordinates: [
            [
              [150.0, -21.0],
              [151.0, -21.0],
              [151.0, -20.0],
              [150.0, -20.0],
              [150.0, -21.0],
            ],
          ],
          metadata: { description: "Survey box" },
        },
      ],
    } as never;
    expect(toFeatureCollection(geometry)).toEqual({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [146.5, -18.5] },
          properties: { metadata: { description: "Pelorus Reef" } },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [150.0, -20.0] },
          properties: {},
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [150.0, -21.0],
                [151.0, -21.0],
                [151.0, -20.0],
                [150.0, -20.0],
                [150.0, -21.0],
              ],
            ],
          },
          properties: { metadata: { description: "Survey box" } },
        },
      ],
    });
  });

  it("should return undefined when the record has no geometry", () => {
    expect(toFeatureCollection(undefined)).toBeUndefined();
    expect(
      toFeatureCollection({
        type: "GeometryCollection",
        geometries: [],
      })
    ).toBeUndefined();
  });
});

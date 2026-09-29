import { describe, it, expect, vi } from "vitest";
import DirectSelect from "../DirectSelect";

describe("DirectSelect custom MapboxDraw mode", () => {
  it("resizes a bounding box as a rectangle when a corner is dragged", () => {
    const feature = {
      properties: { selectionType: "bbox" },
      coordinates: [
        [
          [140, -30],
          [150, -30],
          [150, -40],
          [140, -40],
        ],
      ],
      setCoordinates: vi.fn(),
    };
    const state = { feature, selectedCoordPaths: ["0.2"] };

    DirectSelect.dragVertex.call({}, state, {}, { lng: 5, lat: -2 });

    // South-east corner moves, north-west corner stays fixed
    expect(feature.setCoordinates).toHaveBeenCalledWith([
      [
        [140, -30],
        [155, -30],
        [155, -42],
        [140, -42],
      ],
    ]);
  });

  it("keeps a bounding box rectangular when a corner is dragged past the opposite corner", () => {
    const feature = {
      properties: { selectionType: "bbox" },
      coordinates: [
        [
          [140, -30],
          [150, -30],
          [150, -40],
          [140, -40],
        ],
      ],
      setCoordinates: vi.fn(),
    };
    const state = { feature, selectedCoordPaths: ["0.0"] };

    DirectSelect.dragVertex.call({}, state, {}, { lng: 20, lat: -15 });

    expect(feature.setCoordinates).toHaveBeenCalledWith([
      [
        [160, -45],
        [150, -45],
        [150, -40],
        [160, -40],
      ],
    ]);
  });

  it("moves only the dragged vertex of a polygon", () => {
    const feature = {
      properties: { selectionType: "polygon" },
      coordinates: [
        [
          [140, -30],
          [150, -30],
          [145, -40],
        ],
      ],
      getCoordinate: vi.fn(() => [150, -30]),
      updateCoordinate: vi.fn(),
      setCoordinates: vi.fn(),
    };
    const state = { feature, selectedCoordPaths: ["0.1"] };

    DirectSelect.dragVertex.call({}, state, {}, { lng: 5, lat: -2 });

    expect(feature.updateCoordinate).toHaveBeenCalledWith("0.1", 155, -32);
    expect(feature.setCoordinates).not.toHaveBeenCalled();
  });

  it("moves only the dragged vertex of an untyped shape that is not 4 corners", () => {
    const feature = {
      properties: {},
      coordinates: [
        [
          [140, -30],
          [150, -30],
          [155, -35],
          [150, -40],
          [140, -40],
        ],
      ],
      getCoordinate: vi.fn(() => [155, -35]),
      updateCoordinate: vi.fn(),
      setCoordinates: vi.fn(),
    };
    const state = { feature, selectedCoordPaths: ["0.2"] };

    DirectSelect.dragVertex.call({}, state, {}, { lng: 5, lat: -2 });

    expect(feature.updateCoordinate).toHaveBeenCalledWith("0.2", 160, -37);
    expect(feature.setCoordinates).not.toHaveBeenCalled();
  });

  it("shows corner handles but no midpoints for a bounding box", () => {
    const push = vi.fn();
    const state = {
      featureId: "box1",
      feature: { properties: { selectionType: "bbox" } },
      selectedCoordPaths: [],
    };
    const geojson = {
      type: "Feature",
      properties: { id: "box1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [140, -30],
            [150, -30],
            [150, -40],
            [140, -40],
            [140, -30],
          ],
        ],
      },
    };

    DirectSelect.toDisplayFeatures.call(
      { map: {}, fireActionable: vi.fn() },
      state,
      geojson,
      push
    );

    const metas = push.mock.calls.map(([feature]) => feature.properties.meta);
    expect(metas.filter((meta) => meta === "vertex")).toHaveLength(4);
    expect(metas).not.toContain("midpoint");
  });

  it("shows corner handles and midpoints for a polygon", () => {
    const push = vi.fn();
    const state = {
      featureId: "poly1",
      feature: { properties: { selectionType: "polygon" } },
      selectedCoordPaths: [],
    };
    const geojson = {
      type: "Feature",
      properties: { id: "poly1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [140, -30],
            [150, -30],
            [145, -40],
            [140, -30],
          ],
        ],
      },
    };

    DirectSelect.toDisplayFeatures.call(
      { map: {}, fireActionable: vi.fn() },
      state,
      geojson,
      push
    );

    const metas = push.mock.calls.map(([feature]) => feature.properties.meta);
    expect(metas.filter((meta) => meta === "vertex")).toHaveLength(3);
    expect(metas.filter((meta) => meta === "midpoint")).toHaveLength(3);
  });
});

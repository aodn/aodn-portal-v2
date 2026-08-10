import { describe, it, expect, vi } from "vitest";
import DrawRectangle from "../DrawRectangle";

describe("DrawRectangle custom MapboxDraw mode", () => {
  it("should initialize feature onSetup with empty coordinates polygon", () => {
    const mockCtx = {
      newFeature: vi.fn((f) => ({ ...f, id: "rect1" })),
      addFeature: vi.fn(),
      clearSelectedFeatures: vi.fn(),
      updateUIClasses: vi.fn(),
      setActionableState: vi.fn(),
      map: { doubleClickZoom: { disable: vi.fn(), enable: vi.fn() } },
    };

    const state = DrawRectangle.onSetup.call(mockCtx, {});
    expect(state.rectangle).toBeDefined();
    expect(mockCtx.newFeature).toHaveBeenCalledWith({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[]],
      },
    });
    expect(mockCtx.addFeature).toHaveBeenCalled();
  });

  it("should set 4-corner ring once onMouseMove (no closing vertex)", () => {
    const mockRectangle = {
      setCoordinates: vi.fn(),
      updateCoordinate: vi.fn(),
    };
    const state = {
      startPoint: [140, -35],
      rectangle: mockRectangle,
    };
    const e = { lngLat: { lng: 145, lat: -30 } };

    DrawRectangle.onMouseMove(state, e);

    expect(mockRectangle.setCoordinates).toHaveBeenCalledTimes(1);
    expect(mockRectangle.setCoordinates).toHaveBeenCalledWith([
      [
        [140, -35],
        [145, -35],
        [145, -30],
        [140, -30],
      ],
    ]);
    // Prefer a single batch write over five per-vertex updates
    expect(mockRectangle.updateCoordinate).not.toHaveBeenCalled();
  });

  it("should skip onMouseMove when pointer position is unchanged", () => {
    const mockRectangle = {
      setCoordinates: vi.fn(),
    };
    const state = {
      startPoint: [140, -35],
      lastPoint: [145, -30],
      rectangle: mockRectangle,
    };
    const e = { lngLat: { lng: 145, lat: -30 } };

    DrawRectangle.onMouseMove(state, e);

    expect(mockRectangle.setCoordinates).not.toHaveBeenCalled();
  });

  it("should delete feature on second click if area is zero (single click without drag)", () => {
    const mockCtx = {
      onMouseMove: vi.fn(),
      updateUIClasses: vi.fn(),
      deleteFeature: vi.fn(),
      changeMode: vi.fn(),
    };
    const state = {
      startPoint: [140, -35],
      rectangle: { id: "rect1" },
    };
    const e = { lngLat: { lng: 140, lat: -35 } };

    DrawRectangle.onClick.call(mockCtx, state, e);

    expect(mockCtx.deleteFeature).toHaveBeenCalledWith(["rect1"], {
      silent: true,
    });
  });

  it("should fire draw.create onStop if rectangle is valid closed polygon and not remove 5th coordinate", () => {
    const mockMap = {
      fire: vi.fn(),
      doubleClickZoom: { enable: vi.fn() },
    };
    const mockRectangle = {
      id: "rect1",
      getCoordinates: vi.fn(() => [
        [
          [140, -35],
          [145, -35],
          [145, -30],
          [140, -30],
          [140, -35],
        ],
      ]),
      isValid: vi.fn(() => true),
      toGeoJSON: vi.fn(() => ({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [140, -35],
              [145, -35],
              [145, -30],
              [140, -30],
              [140, -35],
            ],
          ],
        },
      })),
      removeCoordinate: vi.fn(),
    };

    const mockCtx = {
      map: mockMap,
      updateUIClasses: vi.fn(),
      activateUIButton: vi.fn(),
      getFeature: vi.fn(() => mockRectangle),
      deleteFeature: vi.fn(),
    };

    const state = { rectangle: mockRectangle };
    DrawRectangle.onStop.call(mockCtx, state);

    expect(mockRectangle.removeCoordinate).not.toHaveBeenCalled();
    expect(mockMap.fire).toHaveBeenCalledWith(
      "draw.create",
      expect.objectContaining({
        features: [expect.any(Object)],
      })
    );
  });
});

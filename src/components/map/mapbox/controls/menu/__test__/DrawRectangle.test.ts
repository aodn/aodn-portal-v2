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

  it("should update 5 closed coordinates onMouseMove", () => {
    const mockRectangle = {
      updateCoordinate: vi.fn(),
    };
    const state = {
      startPoint: [140, -35],
      rectangle: mockRectangle,
    };
    const e = { lngLat: { lng: 145, lat: -30 } };

    DrawRectangle.onMouseMove(state, e);

    expect(mockRectangle.updateCoordinate).toHaveBeenCalledWith(
      "0.0",
      140,
      -35
    );
    expect(mockRectangle.updateCoordinate).toHaveBeenCalledWith(
      "0.1",
      145,
      -35
    );
    expect(mockRectangle.updateCoordinate).toHaveBeenCalledWith(
      "0.2",
      145,
      -30
    );
    expect(mockRectangle.updateCoordinate).toHaveBeenCalledWith(
      "0.3",
      140,
      -30
    );
    expect(mockRectangle.updateCoordinate).toHaveBeenCalledWith(
      "0.4",
      140,
      -35
    );
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

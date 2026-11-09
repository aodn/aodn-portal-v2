import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import DrawRectangle from "@/components/map/mapbox/controls/menu/DrawRectangle";

describe("DrawRectangle custom MapboxDraw mode", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });
  it("should initialize feature onSetup with empty coordinates polygon", () => {
    const mockCtx = {
      newFeature: vi.fn((f) => ({ ...f, id: "rect1" })),
      addFeature: vi.fn(),
      clearSelectedFeatures: vi.fn(),
      updateUIClasses: vi.fn(),
      setActionableState: vi.fn(),
      map: {
        doubleClickZoom: {
          disable: vi.fn(),
          enable: vi.fn(),
          isEnabled: () => true,
        },
        dragPan: { disable: vi.fn(), enable: vi.fn(), isEnabled: () => true },
      },
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
    expect(mockCtx.map.dragPan.disable).toHaveBeenCalled();
  });

  it("should keep rectangle drawn with press, drag and release", () => {
    const mockRectangle = { id: "rect1", setCoordinates: vi.fn() };
    const mockCtx = {
      onMouseMove: DrawRectangle.onMouseMove,
      onClick: DrawRectangle.onClick,
      updateUIClasses: vi.fn(),
      deleteFeature: vi.fn(),
      changeMode: vi.fn(),
    };
    const state = { rectangle: mockRectangle };

    DrawRectangle.onMouseDown.call(mockCtx, state, {
      lngLat: { lng: 140, lat: -35 },
    });
    DrawRectangle.onDrag.call(mockCtx, state, {
      lngLat: { lng: 145, lat: -30 },
    });
    DrawRectangle.onMouseUp.call(mockCtx, state, {
      lngLat: { lng: 145, lat: -30 },
    });

    expect(mockRectangle.setCoordinates).toHaveBeenLastCalledWith([
      [
        [140, -35],
        [145, -35],
        [145, -30],
        [140, -30],
      ],
    ]);
    expect(mockCtx.deleteFeature).not.toHaveBeenCalled();
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
      dragPan: { enable: vi.fn() },
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

    const state = {
      rectangle: mockRectangle,
      endPoint: [145, -30],
      dragPanEnabled: true,
      doubleClickZoomEnabled: true,
    };
    DrawRectangle.onStop.call(mockCtx, state);

    expect(mockRectangle.removeCoordinate).not.toHaveBeenCalled();
    expect(mockMap.dragPan.enable).toHaveBeenCalled();
    expect(mockMap.fire).toHaveBeenCalledWith(
      "draw.create",
      expect.objectContaining({
        features: [expect.any(Object)],
      })
    );
  });
  it("claims touchstart and updates even moves below Draw's tap tolerance", () => {
    const ctx = {
      ...DrawRectangle,
      updateUIClasses: vi.fn(),
      deleteFeature: vi.fn(),
      changeMode: vi.fn(),
    };
    const rectangle = { id: "rect1", setCoordinates: vi.fn() };
    const state = { rectangle };
    const preventDefault = vi.fn();
    DrawRectangle.onTouchStart.call(ctx, state, {
      preventDefault,
      lngLat: { lng: 140, lat: -35 },
    });
    expect(preventDefault).toHaveBeenCalledOnce();
    const move = {
      originalEvent: {
        touches: [{}],
        cancelable: true,
        preventDefault: vi.fn(),
      },
      lngLat: { lng: 141, lat: -34 },
    };
    DrawRectangle.onTouchMove.call(ctx, state, move);
    expect(move.originalEvent.preventDefault).toHaveBeenCalledOnce();
    DrawRectangle.onDrag.call(ctx, state, move);
    expect(rectangle.setCoordinates).toHaveBeenCalledOnce();
    DrawRectangle.onTouchEnd.call(ctx, state, move);
    DrawRectangle.onTap.call(ctx, state, move);
    vi.runAllTimers();
    expect(ctx.changeMode).toHaveBeenCalledExactlyOnceWith("simple_select", {
      featureIds: ["rect1"],
    });
  });

  it("discards a tap and completes only once", () => {
    const ctx = {
      ...DrawRectangle,
      updateUIClasses: vi.fn(),
      deleteFeature: vi.fn(),
      changeMode: vi.fn(),
    };
    const state = { rectangle: { id: "rect1", setCoordinates: vi.fn() } };
    const event = {
      preventDefault: vi.fn(),
      lngLat: { lng: 140, lat: -35 },
    };
    DrawRectangle.onTouchStart.call(ctx, state, event);
    DrawRectangle.onTap.call(ctx, state, event);
    vi.runAllTimers();
    expect(ctx.deleteFeature).toHaveBeenCalledOnce();
    expect(ctx.changeMode).toHaveBeenCalledExactlyOnceWith("simple_select");
  });

  it.each([true, false])(
    "restores dragPan=%s after cancellation",
    (enabled) => {
      const ctx = {
        map: { dragPan: { enable: vi.fn() } },
        updateUIClasses: vi.fn(),
        activateUIButton: vi.fn(),
        getFeature: vi.fn(),
      };
      DrawRectangle.onStop.call(ctx, {
        rectangle: { id: "rect1" },
        dragPanEnabled: enabled,
        dragPanOptions: { deceleration: 1000 },
      });
      expect(ctx.map.dragPan.enable).toHaveBeenCalledTimes(enabled ? 1 : 0);
      if (enabled) {
        expect(ctx.map.dragPan.enable).toHaveBeenCalledWith({
          deceleration: 1000,
        });
      }
    }
  );
  it("cancels a partial rectangle and clears a pending completion", () => {
    const rectangle = {
      id: "rect1",
      getCoordinates: () => [
        [
          [140, -35],
          [145, -35],
          [145, -30],
          [140, -30],
          [140, -35],
        ],
      ],
      isValid: () => true,
    };
    const changeMode = vi.fn();
    const ctx = {
      map: {
        dragPan: { enable: vi.fn() },
        doubleClickZoom: { enable: vi.fn(), disable: vi.fn() },
        fire: vi.fn(),
      },
      updateUIClasses: vi.fn(),
      activateUIButton: vi.fn(),
      getFeature: () => rectangle,
      deleteFeature: vi.fn(),
    };
    DrawRectangle.onStop.call(ctx, {
      rectangle,
      doubleClickZoomEnabled: false,
      finishTimeout: setTimeout(changeMode, 0),
    });
    vi.runAllTimers();
    expect(ctx.map.fire).not.toHaveBeenCalled();
    expect(ctx.deleteFeature).toHaveBeenCalledWith(["rect1"], { silent: true });
    expect(changeMode).not.toHaveBeenCalled();
    expect(ctx.map.doubleClickZoom.disable).toHaveBeenCalledOnce();
    expect(ctx.map.doubleClickZoom.enable).not.toHaveBeenCalled();
  });
});

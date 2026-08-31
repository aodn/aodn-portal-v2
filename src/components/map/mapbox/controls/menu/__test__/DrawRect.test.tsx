import { fireEvent, render, screen } from "@testing-library/react";
import type { Map as Mapbox } from "mapbox-gl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DrawRect, { DRAW_POLYGON_MODE, DRAW_RECTANGLE_MODE } from "../DrawRect";

const mocks = vi.hoisted(() => ({
  currentMode: "simple_select",
  draw: {
    add: vi.fn(),
    changeMode: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
    getAll: vi.fn(() => ({ features: [] })),
    getMode: vi.fn(),
    getSelectedIds: vi.fn(() => []),
    setFeatureProperty: vi.fn(),
  },
}));

vi.mock("@mapbox/mapbox-gl-draw", () => {
  const MapboxDraw = Object.assign(
    vi.fn(() => mocks.draw),
    { modes: {} }
  );
  return { default: MapboxDraw };
});

const createMockMap = () => {
  const container = document.createElement("div");
  container.id = "draw-rect-test-map";
  document.body.appendChild(container);

  return {
    addControl: vi.fn(),
    dragPan: {
      disable: vi.fn(),
      enable: vi.fn(),
    },
    getContainer: vi.fn(() => container),
    off: vi.fn(),
    on: vi.fn(),
    removeControl: vi.fn(),
  } as unknown as Mapbox;
};

describe("DrawRect selection tool toggles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.currentMode = "simple_select";
    mocks.draw.getMode.mockImplementation(() => mocks.currentMode);
    mocks.draw.changeMode.mockImplementation((mode: string) => {
      mocks.currentMode = mode;
    });
  });

  it("disables bounding box drawing when the active tool is clicked again", () => {
    render(<DrawRect map={createMockMap()} />);
    const button = screen.getByRole("button", { name: "draw-rect-menu" });

    fireEvent.click(button);
    expect(mocks.draw.changeMode).toHaveBeenLastCalledWith(DRAW_RECTANGLE_MODE);

    fireEvent.click(button);
    expect(mocks.draw.changeMode).toHaveBeenLastCalledWith("simple_select");
  });

  it("disables polygon drawing when the active tool is clicked again", () => {
    render(<DrawRect map={createMockMap()} />);
    const button = screen.getByRole("button", {
      name: "polygon-selection-menu",
    });

    fireEvent.click(button);
    expect(mocks.draw.changeMode).toHaveBeenLastCalledWith(DRAW_POLYGON_MODE);

    fireEvent.click(button);
    expect(mocks.draw.changeMode).toHaveBeenLastCalledWith("simple_select");
  });
});

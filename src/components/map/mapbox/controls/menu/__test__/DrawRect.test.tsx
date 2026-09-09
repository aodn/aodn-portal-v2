import { act, fireEvent, render, screen } from "@testing-library/react";
import type { Map as Mapbox } from "mapbox-gl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DrawRect, { DRAW_POLYGON_MODE, DRAW_RECTANGLE_MODE } from "../DrawRect";

const mocks = vi.hoisted(() => ({
  currentMode: "simple_select",
  setLngLat: vi.fn(),
  draw: {
    add: vi.fn(),
    get: vi.fn(),
    changeMode: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
    getAll: vi.fn((): { features: unknown[] } => ({ features: [] })),
    getMode: vi.fn(),
    getSelectedIds: vi.fn((): string[] => []),
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

vi.mock("mapbox-gl", async (importOriginal) => {
  const original = await importOriginal<typeof import("mapbox-gl")>();
  return {
    ...original,
    Marker: class {
      element: HTMLElement;
      constructor({ element }: { element: HTMLElement }) {
        this.element = element;
      }
      setLngLat(position: [number, number]) {
        mocks.setLngLat(position);
        return this;
      }
      addTo(map: Mapbox) {
        map.getContainer().appendChild(this.element);
        return this;
      }
      remove() {
        this.element.remove();
      }
    },
  };
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

describe("DrawRect keyboard delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.currentMode = "simple_select";
    mocks.draw.getMode.mockImplementation(() => mocks.currentMode);
    mocks.draw.changeMode.mockImplementation((mode: string) => {
      mocks.currentMode = mode;
    });
    mocks.draw.getSelectedIds.mockReturnValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
    mocks.draw.getAll.mockReturnValue({ features: [] });
  });

  it("Delete key deletes all features when none are selected", () => {
    vi.useFakeTimers();
    mocks.draw.getAll.mockReturnValue({
      features: [
        {
          id: "feature-1",
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
              ],
            ],
          },
          properties: {},
        },
      ],
    });

    render(<DrawRect map={createMockMap()} />);

    // Let the 100ms mode-polling interval flip hasFeatures to true
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // The mount-time reconcile effect also calls deleteAll() once (features
    // defaults to []); clear that unrelated call before exercising the key.
    mocks.draw.deleteAll.mockClear();
    mocks.draw.delete.mockClear();

    fireEvent.keyDown(document, { key: "Delete" });

    expect(mocks.draw.deleteAll).toHaveBeenCalledTimes(1);
    expect(mocks.draw.delete).not.toHaveBeenCalled();
  });

  it("Backspace key deletes only the selected features", () => {
    vi.useFakeTimers();
    mocks.draw.getAll.mockReturnValue({
      features: [
        {
          id: "feature-1",
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
              ],
            ],
          },
          properties: {},
        },
      ],
    });
    mocks.draw.getSelectedIds.mockReturnValue(["feature-1"]);

    render(<DrawRect map={createMockMap()} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    mocks.draw.deleteAll.mockClear();
    mocks.draw.delete.mockClear();

    fireEvent.keyDown(document, { key: "Backspace" });

    expect(mocks.draw.delete).toHaveBeenCalledWith(["feature-1"]);
    expect(mocks.draw.deleteAll).not.toHaveBeenCalled();
  });

  it("ignores Delete when no features exist", () => {
    vi.useFakeTimers();
    render(<DrawRect map={createMockMap()} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    mocks.draw.deleteAll.mockClear();
    mocks.draw.delete.mockClear();

    fireEvent.keyDown(document, { key: "Delete" });

    expect(mocks.draw.deleteAll).not.toHaveBeenCalled();
    expect(mocks.draw.delete).not.toHaveBeenCalled();
  });
});

describe("selection labels and individual removal", () => {
  afterEach(() => {
    mocks.draw.getAll.mockReturnValue({ features: [] });
  });

  it("numbers only boxes and renumbers them after individual deletion", () => {
    const features = ["box", "polygon", "box-2"].map((id) => ({
      id,
      type: "Feature",
      properties: { selectionType: id === "polygon" ? "polygon" : "bbox" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
    }));
    mocks.draw.getAll.mockReturnValue({ features });
    mocks.draw.delete.mockImplementation((id: string) => {
      mocks.draw.getAll.mockReturnValue({
        features: features.filter((feature) => feature.id !== id),
      });
    });
    const onChangeFeatures = vi.fn();
    const map = createMockMap();
    const mapClick = vi.fn();
    map.getContainer().addEventListener("click", mapClick);
    const { unmount } = render(
      <DrawRect map={map} onChangeFeatures={onChangeFeatures} />
    );
    expect(
      screen.getByRole("button", { name: "Remove selection 2" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Remove selection/ })
    ).toHaveLength(2);
    mocks.draw.delete.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Remove selection 1" }));
    expect(mocks.draw.delete).toHaveBeenCalledExactlyOnceWith("box");
    expect(
      screen.queryByRole("button", { name: "Remove selection 2" })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Selection 1")).toBeInTheDocument();
    expect(screen.queryByLabelText("Selection 2")).not.toBeInTheDocument();
    expect(onChangeFeatures).toHaveBeenLastCalledWith(
      features.slice(1),
      expect.any(Function)
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove selection 1" }));
    expect(mocks.draw.delete).toHaveBeenLastCalledWith("box-2");
    expect(mapClick).not.toHaveBeenCalled();
    unmount();
    expect(map.getContainer().children).toHaveLength(0);
  });
});

it("moves the box marker during dragging before draw.update and cleans up the listener", () => {
  const feature = {
    id: "drag-box",
    type: "Feature",
    properties: { selectionType: "bbox" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
  };
  mocks.draw.getAll.mockReturnValue({ features: [feature] });
  const map = createMockMap();
  const onChangeFeatures = vi.fn();
  const { unmount } = render(
    <DrawRect map={map} onChangeFeatures={onChangeFeatures} />
  );
  const renderListener = vi
    .mocked(map.on)
    .mock.calls.find(
      ([event]) => event === "draw.render"
    )?.[1] as unknown as () => void;
  expect(renderListener).toBeTypeOf("function");
  onChangeFeatures.mockClear();
  mocks.setLngLat.mockClear();
  mocks.draw.get.mockReturnValue({
    ...feature,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [2, 3],
          [3, 3],
          [3, 4],
          [2, 4],
          [2, 3],
        ],
      ],
    },
  });
  act(() => renderListener());
  expect(mocks.draw.get).toHaveBeenCalledWith("drag-box");
  expect(mocks.setLngLat).toHaveBeenLastCalledWith([3, 4]);
  expect(onChangeFeatures).not.toHaveBeenCalled();
  unmount();
  expect(map.off).toHaveBeenCalledWith("draw.render", renderListener);
  mocks.draw.getAll.mockReturnValue({ features: [] });
});

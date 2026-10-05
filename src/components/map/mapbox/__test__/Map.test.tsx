import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapDefaultConfig } from "../constants";

const mocks = vi.hoisted(() => ({
  minZoomCalls: [] as number[],
  resizeCallbacks: [] as ResizeObserverCallback[],
}));

vi.mock("@/components/map/mapbox/mapboxgl", () => {
  class FakeMap {
    private readonly container: HTMLElement;

    constructor(options: { container: string }) {
      this.container = document.getElementById(options.container)!;
    }

    getContainer = () => this.container;
    setMinZoom = (zoom: number) => void mocks.minZoomCalls.push(zoom);
    setProjection = vi.fn();
    dragRotate = { disable: vi.fn() };
    on = vi.fn();
    off = vi.fn();
    once = vi.fn();
    jumpTo = vi.fn();
    easeTo = vi.fn();
    resize = vi.fn();
    remove = vi.fn();
  }

  class FakeLngLatBounds {
    getCenter = () => ({ lng: 0, lat: 0 });
  }

  return { default: { Map: FakeMap, LngLatBounds: FakeLngLatBounds } };
});

// Keep the callbacks so a test can report a new container width later.
class TestResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {
    mocks.resizeCallbacks.push(callback);
  }
  observe = () => this.callback([], this as unknown as ResizeObserver);
  unobserve = () => {};
  disconnect = () => {};
}

const PANEL_ID = "test-map";

const mountContainer = (width: number) => {
  const container = document.createElement("div");
  container.id = PANEL_ID;
  Object.defineProperty(container, "offsetWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(container, "offsetHeight", {
    value: 600,
    configurable: true,
  });
  document.body.appendChild(container);
  return container;
};

describe("ReactMap zoom floor", () => {
  beforeEach(() => {
    mocks.minZoomCalls.length = 0;
    mocks.resizeCallbacks.length = 0;
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  // One world is 512px at zoom 0, so 2048px of container is exactly zoom 2.
  it("stops a wide map from zooming out past one whole world", async () => {
    mountContainer(2048);
    const { default: ReactMap } = await import("../Map");

    render(<ReactMap panelId={PANEL_ID} />);

    expect(mocks.minZoomCalls).toContain(2);
  });

  it("keeps MIN_ZOOM when the world already overflows the container", async () => {
    mountContainer(800);
    const { default: ReactMap } = await import("../Map");

    render(<ReactMap panelId={PANEL_ID} />);

    // log2(800 / 512) is below MIN_ZOOM, so the configured floor wins.
    expect(mocks.minZoomCalls).toEqual([MapDefaultConfig.MIN_ZOOM]);
  });

  it("raises the floor again when the container grows", async () => {
    const container = mountContainer(2048);
    const { default: ReactMap } = await import("../Map");

    render(<ReactMap panelId={PANEL_ID} />);

    Object.defineProperty(container, "offsetWidth", {
      value: 4096,
      configurable: true,
    });
    mocks.resizeCallbacks.forEach((callback) =>
      callback([], {} as ResizeObserver)
    );

    await waitFor(() => expect(mocks.minZoomCalls).toContain(3));
  });
});

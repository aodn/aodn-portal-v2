// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";

class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // Trigger the callback immediately to simulate observing behavior
    this.callback([], this);
  }

  unobserve() {}

  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;

// A global mock to avoid real layer fetch calls, if you need different return value
// you can override in the test file
vi.mock("./components/map/mapbox/layers/StaticLayer", async () => {
  const actual = (await vi.importActual(
    "./components/map/mapbox/layers/StaticLayer"
  )) as any;
  return {
    ...actual,
    fetchMarineParkOptions: vi.fn().mockResolvedValue([]),
    fetchMarineEcoregionOptions: vi.fn().mockResolvedValue([]),
    fetchAllenCoralAtlasOptions: vi.fn().mockResolvedValue([]),
  };
});

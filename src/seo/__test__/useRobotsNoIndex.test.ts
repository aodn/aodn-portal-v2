import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRobotsNoIndex } from "../useRobotsNoIndex";

const robotsMeta = () =>
  document.head.querySelector('meta[name="robots"][content="noindex"]');

describe("useRobotsNoIndex", () => {
  it("injects the noindex meta while mounted and removes it on unmount", () => {
    const { unmount } = renderHook(() => useRobotsNoIndex());
    expect(robotsMeta()).not.toBeNull();
    unmount();
    expect(robotsMeta()).toBeNull();
  });

  it("does nothing while disabled", () => {
    const { unmount } = renderHook(() => useRobotsNoIndex(false));
    expect(robotsMeta()).toBeNull();
    unmount();
  });

  it("injects once enabled turns true", () => {
    const { rerender, unmount } = renderHook(
      ({ enabled }) => useRobotsNoIndex(enabled),
      { initialProps: { enabled: false } }
    );
    expect(robotsMeta()).toBeNull();
    rerender({ enabled: true });
    expect(robotsMeta()).not.toBeNull();
    unmount();
    expect(robotsMeta()).toBeNull();
  });
});

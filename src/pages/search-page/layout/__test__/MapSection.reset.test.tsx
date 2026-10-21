import type { ReactNode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MapEventEnum } from "@/components/map/mapbox/constants";
import MapSection from "@/pages/search-page/layout/MapSection";

const mocks = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  return {
    moving: false,
    fit: vi.fn(),
    listeners,
    map: {
      once: (_event: string, callback: () => void) => {
        listeners.add(callback);
      },
      off: (_event: string, callback: () => void) => {
        listeners.delete(callback);
      },
      isMoving: () => mocks.moving,
      emitMoveEnd: () => {
        const callbacks = [...listeners];
        listeners.clear();
        callbacks.forEach((callback) => callback());
      },
    },
  };
});

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: false }),
}));
vi.mock("@/hooks/useTabNavigation", () => ({
  default: () => ({}),
}));
vi.mock("@/utils/MapUtils", () => ({
  fitToDefaultExtent: (...args: unknown[]) => mocks.fit(...args),
}));
vi.mock("@/components/map/mapbox/Map", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/map/mapbox/controls/Controls", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/map/mapbox/controls/ToggleControl", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/ScaleControl", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/DisplayCoordinate", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/menu/MenuControl", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/menu/MenuControlGroup", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/map/mapbox/controls/menu/BaseMapSwitcher", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/menu/BookmarkListMenu", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/menu/ReferenceLayerSwitcher", () => ({
  default: () => null,
  staticBaseLayerConfig: [],
}));
vi.mock("@/components/map/mapbox/controls/menu/MapLayerSwitcher", async () => {
  const actual = await vi.importActual<
    typeof import("@/components/map/mapbox/controls/menu/MapLayerSwitcher")
  >("@/components/map/mapbox/controls/menu/MapLayerSwitcher");
  return { ...actual, default: () => null };
});
vi.mock("@/components/map/mapbox/layers/Layers", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/map/mapbox/layers/HeatmapLayer", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/layers/UnclusterLayer", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/layers/StaticLayer", () => ({
  createStaticLayers: () => null,
}));
vi.mock("@/components/map/mapbox/layers/ClusterLayer", () => ({
  default: ({ preferCurrentCentroid }: { preferCurrentCentroid?: boolean }) => (
    <div data-testid="prefer-centroid">{String(preferCurrentCentroid)}</div>
  ),
}));
vi.mock("@/components/map/mapbox/controls/NavigationControl", () => ({
  default: ({ onReset }: { onReset?: (map: typeof mocks.map) => void }) => (
    <button type="button" onClick={() => onReset?.(mocks.map)}>
      Reset zoom
    </button>
  ),
}));
vi.mock("@/app/layout/MiniFooter", () => ({
  default: () => null,
  MAP_FOOTER_HEIGHT: "0px",
}));

const renderSection = (collections: never[]) => {
  const onMapZoomOrMove = vi.fn();
  const view = render(
    <MapSection
      showFullList={false}
      showFullMap={false}
      collections={collections}
      onMapZoomOrMove={onMapZoomOrMove}
      onToggleClicked={() => {}}
    />
  );
  return { ...view, onMapZoomOrMove };
};

describe("zoom reset search and centroid", () => {
  beforeEach(() => {
    mocks.moving = false;
    mocks.listeners.clear();
    mocks.fit.mockClear();
  });

  it("forces a search and keeps the centroid flag false until collections change", () => {
    const current: never[] = [];
    const { onMapZoomOrMove, rerender } = renderSection(current);

    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("true");
    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));

    expect(mocks.fit).toHaveBeenCalledWith(mocks.map, undefined);
    expect(onMapZoomOrMove).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MapEventEnum.MOVE_END,
        target: mocks.map,
      }),
      true
    );
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("false");

    rerender(
      <MapSection
        showFullList={false}
        showFullMap={false}
        collections={current}
        onMapZoomOrMove={onMapZoomOrMove}
        onToggleClicked={() => {}}
      />
    );
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("false");

    rerender(
      <MapSection
        showFullList={false}
        showFullMap={false}
        collections={[]}
        onMapZoomOrMove={onMapZoomOrMove}
        onToggleClicked={() => {}}
      />
    );
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("true");
  });

  it("waits for the reset move to finish before searching", () => {
    mocks.moving = true;
    const { onMapZoomOrMove } = renderSection([]);

    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));

    expect(mocks.fit).toHaveBeenCalledOnce();
    expect(onMapZoomOrMove).not.toHaveBeenCalled();
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("true");

    act(() => {
      mocks.map.emitMoveEnd();
    });

    expect(onMapZoomOrMove).toHaveBeenCalledWith(
      expect.objectContaining({ type: MapEventEnum.MOVE_END }),
      true
    );
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("false");
  });
});

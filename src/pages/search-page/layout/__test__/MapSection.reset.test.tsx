import type { ReactNode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MapEventEnum } from "@/components/map/mapbox/constants";
import { ProgressType } from "@/components/map/mapbox/MapContext";
import MapSection from "@/pages/search-page/layout/MapSection";

const mocks = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  return {
    moving: false,
    fit: vi.fn(),
    listeners,
    map: {
      on: (_event: string, callback: () => void) => {
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

const renderSection = (collections: never[], progress?: ProgressType) => {
  const onMapZoomOrMove = vi.fn();
  const view = render(
    <MapSection
      showFullList={false}
      showFullMap={false}
      collections={collections}
      progress={progress}
      onMapZoomOrMove={onMapZoomOrMove}
      onToggleClicked={() => {}}
    />
  );
  return { ...view, onMapZoomOrMove };
};

const section = (
  collections: never[],
  onMapZoomOrMove: ReturnType<typeof vi.fn>,
  progress?: ProgressType
) => (
  <MapSection
    showFullList={false}
    showFullMap={false}
    collections={collections}
    progress={progress}
    onMapZoomOrMove={onMapZoomOrMove}
    onToggleClicked={() => {}}
  />
);

describe("zoom reset search and centroid", () => {
  beforeEach(() => {
    mocks.moving = false;
    mocks.listeners.clear();
    mocks.fit.mockReset();
  });

  it("forces a search and clears the centroid flag when that search finishes", () => {
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

    rerender(section(current, onMapZoomOrMove));
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("false");

    rerender(section(current, onMapZoomOrMove, ProgressType.LINEAR));
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("false");

    // The search resolved without replacing the collections array.
    rerender(section(current, onMapZoomOrMove));
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("true");

    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("false");
    rerender(section([], onMapZoomOrMove));
    expect(screen.getByTestId("prefer-centroid")).toHaveTextContent("true");
  });

  it("waits for the reset move to finish before searching", () => {
    mocks.moving = true;
    // A moveend during flyTo is the interrupted gesture, not the reset.
    mocks.fit.mockImplementation(() => {
      mocks.map.emitMoveEnd();
    });
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
    expect(mocks.listeners.size).toBe(0);
  });

  it("removes the pending moveend listener when the section unmounts", () => {
    mocks.moving = true;
    const { onMapZoomOrMove, unmount } = renderSection([]);

    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));
    expect(mocks.listeners.size).toBe(1);

    unmount();

    expect(mocks.listeners.size).toBe(0);
    act(() => {
      mocks.map.emitMoveEnd();
    });
    expect(onMapZoomOrMove).not.toHaveBeenCalled();
  });
});

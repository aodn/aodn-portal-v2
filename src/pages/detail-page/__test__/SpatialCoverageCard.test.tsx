import { vi, expect, it, beforeEach, afterEach } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { type PropsWithChildren } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  DetailPageContext,
  DetailPageContextDefault,
} from "@/pages/detail-page/context/detail-page-context";
import SpatialCoverageCard from "@/pages/detail-page/features/SpatialCoverageCard";
import { portalTheme } from "@/styles";

const mocks = vi.hoisted(() => ({ mounted: vi.fn(), removed: vi.fn() }));

vi.mock("@/components/map/mapbox/Map", async () => {
  const { useEffect } = await import("react");
  const MockMap = ({ children }: PropsWithChildren) => {
    useEffect(() => {
      mocks.mounted();
      return mocks.removed;
    }, []);
    return <div data-testid="coverage-map">{children}</div>;
  };
  return { default: MockMap };
});
vi.mock("@/components/map/mapbox/layers/Layers", () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>,
}));
vi.mock("@/components/map/mapbox/layers/FitToSpatialExtentsLayer", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/controls/Controls", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/layers/GeojsonLayer", () => ({
  default: ({ onLayerClick }: { onLayerClick: () => void }) => (
    <button onClick={onLayerClick}>Focus coverage</button>
  ),
}));

let notify: IntersectionObserverCallback;
const disconnect = vi.fn();
const observe = vi.fn();
const observer = { disconnect, observe } as unknown as IntersectionObserver;
const collection = new OGCCollection();
const focus = vi.fn();

const view = (record: OGCCollection | undefined = collection) => (
  <ThemeProvider theme={portalTheme}>
    <DetailPageContext.Provider
      value={{ ...DetailPageContextDefault, collection: record }}
    >
      <SpatialCoverageCard onSpatialCoverageLayerClick={focus} />
    </DetailPageContext.Provider>
  </ThemeProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(collection, "getBBox").mockReturnValue([[104, -43, 163, -8]]);
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (callback: IntersectionObserverCallback) {
      notify = callback;
      return observer;
    })
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("reserves space and mounts only once when the viewport approaches", async () => {
  const { unmount } = render(view());
  expect(screen.queryByTestId("coverage-map")).not.toBeInTheDocument();
  expect(screen.getByLabelText("map")).toHaveStyle({ height: "200px" });
  expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
    rootMargin: "200px 0px",
  });
  const enter = (isIntersecting: boolean) =>
    act(() =>
      notify([{ isIntersecting } as IntersectionObserverEntry], observer)
    );
  enter(false);
  expect(mocks.mounted).not.toHaveBeenCalled();
  enter(true);
  // The map itself is lazily loaded, so it arrives a tick after the intersection.
  expect(await screen.findByTestId("coverage-map")).toBeInTheDocument();
  expect(disconnect).toHaveBeenCalled();
  enter(false);
  expect(mocks.mounted).toHaveBeenCalledTimes(1);
  expect(mocks.removed).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Focus coverage"));
  expect(focus).toHaveBeenCalledOnce();
  unmount();
  expect(mocks.removed).toHaveBeenCalledOnce();
});

it("starts observing when spatial data arrives after the initial render", () => {
  const { rerender, unmount } = render(view(new OGCCollection()));
  expect(observe).not.toHaveBeenCalled();
  expect(screen.queryByLabelText("map")).not.toBeInTheDocument();
  rerender(view());
  expect(observe).toHaveBeenCalledOnce();
  unmount();
  expect(disconnect).toHaveBeenCalled();
});

it("mounts immediately when IntersectionObserver is unavailable", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  render(view());
  expect(await screen.findByTestId("coverage-map")).toBeInTheDocument();
});

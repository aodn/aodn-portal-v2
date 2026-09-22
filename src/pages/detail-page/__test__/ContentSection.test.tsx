import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { portalTheme } from "@/styles";
import {
  DetailPageContext,
  DetailPageContextDefault,
} from "@/pages/detail-page/context/detail-page-context";
import ContentSection from "@/pages/detail-page/layout/ContentSection";

const mocks = vi.hoisted(() => ({
  isMobile: true,
  mounted: vi.fn(),
  removed: vi.fn(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isMobile: mocks.isMobile }),
}));
vi.mock("@/pages/detail-page/features/MapPanel", async () => {
  const { useEffect } = await import("react");
  const MockMapPanel = () => {
    useEffect(() => {
      mocks.mounted();
      return mocks.removed;
    }, []);
    return <div data-testid="map-panel" />;
  };
  return { default: MockMapPanel };
});
// The tab panels are not under test and pull in far more than they need to.
vi.mock("@/pages/detail-page/features/SummaryAndDownloadPanel", () => ({
  default: () => <div data-testid="summary-panel" />,
}));
vi.mock("@/pages/detail-page/features/DataAccessPanel", () => ({
  default: () => null,
}));
vi.mock("@/pages/detail-page/features/CitationPanel", () => ({
  default: () => null,
}));
vi.mock("@/pages/detail-page/features/AdditionalInfoPanel", () => ({
  default: () => null,
}));
vi.mock("@/pages/detail-page/features/AssociatedRecordsPanel", () => ({
  default: () => null,
}));

let navigate: ReturnType<typeof useNavigate>;
const CaptureNavigate = () => {
  const nav = useNavigate();
  useEffect(() => {
    navigate = nav;
  }, [nav]);
  return null;
};

const renderAt = (tab: string) =>
  render(
    <ThemeProvider theme={portalTheme}>
      <DetailPageContext.Provider value={DetailPageContextDefault}>
        <MemoryRouter initialEntries={[`/details/some-uuid?tab=${tab}`]}>
          <CaptureNavigate />
          <Routes>
            <Route path="/details/:uuid" element={<ContentSection />} />
          </Routes>
        </MemoryRouter>
      </DetailPageContext.Provider>
    </ThemeProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  mocks.isMobile = true;
});

afterEach(() => cleanup());

describe("ContentSection map pane", () => {
  it("does not load the map on the mobile Summary tab", async () => {
    renderAt("summary");
    expect(await screen.findByTestId("summary-panel")).toBeInTheDocument();
    expect(screen.queryByTestId("map-panel")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Map loading")).not.toBeInTheDocument();
    expect(mocks.mounted).not.toHaveBeenCalled();
  });

  it("loads the map on the mobile Map tab and keeps it mounted after", async () => {
    renderAt("map");
    expect(await screen.findByTestId("map-panel")).toBeVisible();

    act(() => navigate("/details/some-uuid?tab=summary"));
    expect(await screen.findByTestId("summary-panel")).toBeInTheDocument();
    expect(screen.getByTestId("map-panel")).not.toBeVisible();
    expect(mocks.mounted).toHaveBeenCalledOnce();
    expect(mocks.removed).not.toHaveBeenCalled();
  });

  it("shows the map with Summary on wider screens", async () => {
    mocks.isMobile = false;
    renderAt("summary");
    expect(await screen.findByTestId("map-panel")).toBeVisible();
  });
});

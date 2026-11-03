import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

vi.mock("@/pages/detail-page/context/detail-page-context", () => ({
  useDetailPageContext: vi.fn(),
}));

vi.mock(
  "@/pages/detail-page/features/download/DownloadCloudOptimisedCard",
  () => ({
    default: () => <div data-testid="co-card" />,
  })
);

vi.mock(
  "@/pages/detail-page/features/download/DownloadOriginalNetcdfsCard",
  () => ({
    default: () => <div data-testid="original-netcdfs-card" />,
  })
);

vi.mock("@/pages/detail-page/features/download/DownloadWFSCard", () => ({
  default: () => <div data-testid="wfs-card" />,
}));

import DownloadCard from "@/pages/detail-page/features/download/DownloadCard";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import { DownloadServiceType } from "@/pages/detail-page/context/DownloadDefinitions";
import { ILink, OGCCollection } from "@/app/store/OGCCollectionDefinitions";

const coLink: ILink = {
  rel: "summary",
  href: "http://example.com/a.parquet",
  type: "application/x-parquet",
  title: "a.parquet",
};
const originalNetcdfsLink: ILink = {
  rel: "file-list",
  href: "http://example.com/original_netcdfs",
  type: "application/x-netcdf",
  title: "original_netcdfs",
};
const wfsLink: ILink = {
  rel: "wfs",
  href: "http://example.com/wfs",
  type: "",
  title: "layer",
};

const createCollection = (links: ILink[]): OGCCollection => {
  const collection = new OGCCollection();
  collection.links = links;
  return collection;
};

// Keep the download service in real state so the card's effect can set it
const mockContext = (collection: OGCCollection) => {
  vi.mocked(useDetailPageContext).mockImplementation(() => {
    const [downloadService, setDownloadService] = useState(
      DownloadServiceType.Unavailable
    );
    return {
      collection,
      downloadConditions: [],
      getAndSetDownloadConditions: vi.fn(),
      removeDownloadCondition: vi.fn(),
      downloadService,
      setDownloadService,
      selectedCoKey: "",
      setSelectedCoKey: vi.fn(),
    } as any;
  });
};

const renderCard = (links: ILink[]) => {
  mockContext(createCollection(links));
  return render(
    <ThemeProvider theme={createTheme()}>
      <DownloadCard />
    </ThemeProvider>
  );
};

describe("DownloadCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses cloud optimised first", async () => {
    renderCard([coLink, originalNetcdfsLink, wfsLink]);

    expect(await screen.findByTestId("co-card")).toBeInTheDocument();
    expect(
      screen.queryByTestId("original-netcdfs-card")
    ).not.toBeInTheDocument();
  });

  it("uses original netcdfs before WFS", async () => {
    renderCard([originalNetcdfsLink, wfsLink]);

    expect(
      await screen.findByTestId("original-netcdfs-card")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("wfs-card")).not.toBeInTheDocument();
  });

  it("uses WFS when there is no cloud optimised data or original netcdfs", async () => {
    renderCard([wfsLink]);

    expect(await screen.findByTestId("wfs-card")).toBeInTheDocument();
  });
});

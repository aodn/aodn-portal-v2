import { afterAll, afterEach, beforeAll, describe, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../../utils/AppTheme";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { useLocation } from "react-router-dom";
import store from "../../../../../components/common/store/store";
import { Provider } from "react-redux";
import AboutPanel from "../AboutPanel";
import MetadataInformationPanel from "../MetadataInformationPanel";
import CitationPanel from "../CitationPanel";
import LineagePanel from "../LineagePanel";
import AssociatedRecordsPanel from "../AssociatedRecordsPanel";

describe("empty area display", async () => {
  const theme = AppTheme;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
  });
  afterAll(() => {
    server.close();
  });

  test("about panel", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e" + "emptyabout",
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AboutPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Keywords Not Found")).to.exist;
      expect(screen.queryByText("Contacts Not Found")).to.exist;
      expect(screen.queryByText("Credits Not Found")).to.exist;
      expect(screen.queryAllByText("N / A")).toHaveLength(3);
    });
  });

  test("metadata information panel", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e" + "emptymetadata",
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <MetadataInformationPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText("N / A")).toHaveLength(4);
      expect(screen.queryByText("Metadata Contact Not Found")).to.exist;
      expect(screen.queryByText("Metadata Identifier Not Found")).to.exist;
      expect(screen.queryByText("Full Metadata Link Not Found")).to.exist;
      expect(screen.queryByText("Metadata Dates Not Found")).to.exist;
    });
  });

  test("citation panel", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e" + "emptycitation",
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <CitationPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText("N / A")).toHaveLength(4);
      expect(screen.queryByText("License Not Found")).to.exist;
      expect(screen.queryByText("Cited Responsible Parties Not Found")).to
        .exist;
      expect(screen.queryByText("Suggested Citation Not Found")).to.exist;
      expect(screen.queryByText("Constraints Not Found")).to.exist;
    });
  });

  test("lineage panel", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e" + "emptylineage",
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <LineagePanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText("N / A")).toHaveLength(1);
      expect(screen.queryByText("Statement Not Found")).to.exist;
    });
  });

  test("associated records panel", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search:
        "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e" + "emptyassociatedrecords",
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AssociatedRecordsPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText("N / A")).toHaveLength(3);
      expect(screen.queryByText("Parent Record Not Found")).to.exist;
      expect(screen.queryByText("Sibling Records Not Found")).to.exist;
      expect(screen.queryByText("Child Records Not Found")).to.exist;
    });
  });
});

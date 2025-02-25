import { afterAll, afterEach, beforeAll, describe, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../../utils/AppTheme";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { useLocation } from "react-router-dom";
import store from "../../../../../components/common/store/store";
import { Provider } from "react-redux";
import AdditionalInfoPanel from "../AdditionalInfoPanel";
import CitationPanel from "../CitationPanel";
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
      useNavigate: vi.fn(),
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

  test("additional info panel", async () => {
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
            <AdditionalInfoPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Keywords Not Found")).to.exist;
      expect(screen.queryByText("Themes Not Found")).to.exist;
      expect(screen.queryByText("Metadata Contact Not Found")).to.exist;
    });
  });

  test("citation and usage panel", async () => {
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
      expect(screen.queryByText("License Not Found")).to.exist;
      expect(screen.queryByText("Cited Responsible Parties Not Found")).to
        .exist;
      expect(screen.queryByText("Suggested Citation Not Found")).to.exist;
      expect(screen.queryByText("Constraints Not Found")).to.exist;
      expect(screen.queryByText("Contact of Data Owner Not Found")).to.exist;
      expect(screen.queryByText("Credits Not Found")).to.exist;
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

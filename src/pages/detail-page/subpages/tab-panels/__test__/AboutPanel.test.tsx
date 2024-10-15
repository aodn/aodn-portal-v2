import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { server } from "../../../../../__mocks__/server";
import { useLocation } from "react-router-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppTheme from "../../../../../utils/AppTheme";
import store from "../../../../../components/common/store/store";
import { ThemeProvider } from "@mui/material/styles";
import { DetailPageProvider } from "../../../context/detail-page-provider";
import { Provider } from "react-redux";
import AboutPanel from "../AboutPanel";

describe("AboutPanel", async () => {
  const theme = AppTheme;
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: vi.fn(),
    }));

    vi.mocked(useLocation).mockReturnValue({
      state: null,
      hash: "111",
      key: "default",
      pathname: "/details",
      search: "?uuid=5fc91100-4ade-11dc-8f56-00008a07204e",
    });
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
    vi.restoreAllMocks();
  });
  afterAll(() => {
    server.close();
  });
  beforeEach(() => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DetailPageProvider>
            <AboutPanel />
          </DetailPageProvider>
        </ThemeProvider>
      </Provider>
    );
  });

  test("should render AboutPanel", async () => {
    // the panel is rendered
    await waitFor(() => {
      expect(screen.queryAllByText("Credits")).toHaveLength(2);
    });

    await waitFor(() => {
      // infomation is rendered
      expect(screen.queryByText("AODN Discovery Parameter Vocabulary")).to
        .exist;
      expect(
        screen.queryByText(
          "Australian Institute of Marine Science (AIMS) - Bainbridge, S"
        )
      ).to.exist;
      expect(
        screen.queryByText(
          "Australian Institute of Marine Science (AIMS) - Data Manager, AIMS Data Centre"
        )
      );
      expect(
        screen.queryByText(
          "Australia’s Integrated Marine Observing System (IMOS) is enabled by the National Collaborative Research Infrastructure Strategy (NCRIS). It is operated by a consortium of institutions as an unincorporated joint venture, with the University of Tasmania as Lead Agent."
        )
      ).to.exist;
      expect(
        screen.queryByText("Australian Institute of Marine Science (AIMS)")
      ).to.exist;
      expect(screen.queryByText("Bainbridge, Scott, Mr")).to.exist;
    });
  });
});
